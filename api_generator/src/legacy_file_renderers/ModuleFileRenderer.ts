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
import FunctionRenderer from './FunctionRenderer'
import type OperationGroup from '../spec_parser/OperationGroup'
import _ from 'lodash'

export default class ModuleFileRenderer extends BaseRenderer {
  protected templateFile = 'module.mustache'
  private readonly namespace: Namespace
  private readonly group: OperationGroup | undefined

  constructor (namespace: Namespace, group: OperationGroup | undefined = undefined) {
    super()
    this.namespace = namespace
    this.group = group
  }

  view (): Record<string, any> {
    if (this.group) return this.view_group(this.group, this.namespace)
    return this.view_namespace(this.namespace)
  }

  view_namespace (namespace: Namespace): Record<string, any> {
    return {
      root: false,
      doc_namespace: `API-${_.capitalize(_.kebabCase(namespace.name))}`,
      module_name: namespace.module_name,
      function_definitions: _.values(namespace.operation_groups).map((group) => {
        return (new FunctionRenderer(group, namespace)).render()
      }).join('\n\n')
    }
  }

  view_group (group: OperationGroup, namespace: Namespace): Record<string, any> {
    return {
      root: true,
      module_name: group.function_name,
      function_definitions: (new FunctionRenderer(group, namespace)).render()
    }
  }
}
