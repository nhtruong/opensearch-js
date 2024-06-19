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

export default class ModuleFileRenderer extends BaseRenderer {
  protected template_path = 'module.mustache'
  private readonly namespace: Namespace

  constructor (namespace: Namespace) {
    super()
    this.namespace = namespace
  }

  view (): Record<string, any> {
    return {
      module_name: this.namespace.module_name,
      doc_namespace: this.namespace.doc_namespace,
      functions: this.#functions()
    }
  }

  #functions (): Array<Record<string, any>> {
    return _.values(this.namespace.operation_groups)
      .sort((a, b) => a.prototype_name.localeCompare(b.prototype_name))
      .map((group: OperationGroup) => {
        return {
          name: group.prototype_name,
          path: group.file_name
        }
      })
  }
}

/*
function apiFunc(cache, path) {
  return function(...args) {
    if (!cache[location]) cache[location] = require(path);
    return cache[location](...args);
  };
}
 */
