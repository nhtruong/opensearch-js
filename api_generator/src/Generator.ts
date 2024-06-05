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

export default class Generator {
  readonly namespaces: Record<string, Namespace>
  readonly output_folder: string

  constructor (spec_path: string, output_folder: string) {
    this.output_folder = output_folder
    const raw_spec: RawOpenSearchSpec = YAML.parse(fs.readFileSync(spec_path, 'utf8'))
    const operations = (new OperationParser(raw_spec)).operations
    this.namespaces =
      _.fromPairs(
        _.entries(
          _.groupBy(operations, 'namespace')).map(([name, ops]) => [name, new Namespace(name, ops)]))
  }
}
