/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import type Namespace from '../spec_parser/Namespace'
import BaseRenderer from './BaseRenderer'

export default class FunctionTypeRenderer extends BaseRenderer {
  protected templateFile = 'function.type.mustache'
  private readonly namespace: Namespace

  constructor (namespace: Namespace) {
    super()
    this.namespace = namespace
  }

  view (): Record<string, any> {
    return {
      namespace: this.namespace.prototype_name,
      functions: Object.values(this.namespace.operation_groups).map((group) => group.prototype_name)
    }
  }
}
