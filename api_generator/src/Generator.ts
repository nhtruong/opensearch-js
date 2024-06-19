/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

import Namespace from './spec_parser/Namespace'
import { type RawOpenSearchSpec } from './spec_parser/types'
import OperationParser from './spec_parser/OperationParser'
import _ from 'lodash'
import fs from 'fs'
import YAML from 'yaml'
import * as path from 'path'
import ModuleFileRenderer from './renderers/ModuleFileRenderer'
import FunctionFileRenderer from './renderers/FunctionFileRenderer'
import IndexFileRenderer from './renderers/IndexFileRenderer'

export default class Generator {
  readonly namespaces: Record<string, Namespace>
  readonly output_folder: string

  constructor (spec_path: string, output_folder: string) {
    this.output_folder = path.resolve(output_folder, 'api')
    const raw_spec: RawOpenSearchSpec = YAML.parse(fs.readFileSync(spec_path, 'utf8'))
    const operations = (new OperationParser(raw_spec)).operations
    this.namespaces =
      _.fromPairs(
        _.entries(
          _.groupBy(operations, 'namespace'))
          .map(([name, ops]) => [name, new Namespace(name, ops, this.output_folder)]))
  }

  generate (): void {
    this.#make_namespace_folders()
    this.#generate_function_files()
    this.#generate_module_files()
    this.#generate_index_file()
  }

  #make_namespace_folders (): void {
    fs.mkdirSync(this.output_folder, { recursive: true })
    for (const ns of Object.values(this.namespaces)) {
      if (fs.existsSync(ns.folder_path)) fs.rmSync(ns.folder_path, { recursive: true })
      fs.mkdirSync(ns.folder_path)
    }
  }

  #generate_function_files (): void {
    for (const ns of _.values(this.namespaces)) {
      for (const group of _.values(ns.operation_groups)) {
        const renderer = new FunctionFileRenderer(group, ns)
        fs.writeFileSync(path.join(ns.folder_path, `${group.file_name}.js`), renderer.render())
      }
    }
  }

  #generate_module_files (): void {
    for (const ns of _.values(this.namespaces).filter(ns => !ns.root)) {
      const renderer = new ModuleFileRenderer(ns)
      fs.writeFileSync(path.join(ns.folder_path, `${ns.file_name}.js`), renderer.render())
    }
  }

  #generate_index_file (): void {
    const file_path = path.join(this.output_folder, 'index.js')
    const content = new IndexFileRenderer(this.namespaces).render()
    fs.writeFileSync(file_path, content)
  }
}
