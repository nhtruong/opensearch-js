/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

import BaseRenderer from './BaseRenderer'
import type Namespace from '../spec_parser/Namespace'
import type OperationGroup from '../spec_parser/OperationGroup'
import _ from 'lodash'

export default class IndexFileRenderer extends BaseRenderer {
  protected templateFile = 'index.mustache'
  private readonly namespaces: Record<string, Namespace>
  private readonly root_namespace: Namespace

  constructor (namespaces: Record<string, Namespace>) {
    super()
    this.root_namespace = namespaces._core
    delete namespaces._core
    this.namespaces = namespaces
  }

  view (): Record<string, any> {
    return {
      root_functions: this.#root_functions(),
      api_modules: this.#api_modules()
    }
  }

  #root_functions (): Array<Record<string, any>> {
    return _.values(this.root_namespace.operation_groups)
      .sort((a, b) => a.prototype_name.localeCompare(b.prototype_name))
      .map((group: OperationGroup) => {
        return {
          name: group.prototype_name,
          path: group.file_name
        }
      })
  }

  #api_modules (): Array<Record<string, any>> {
    return _.values(this.namespaces)
      .sort((a, b) => a.module_name.localeCompare(b.module_name))
      .map((namespace: Namespace) => {
        return {
          name: namespace.prototype_name,
          path: namespace.file_name
        }
      })
  }
}
