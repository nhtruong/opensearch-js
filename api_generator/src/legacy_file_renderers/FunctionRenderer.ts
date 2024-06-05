/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import BaseRenderer from './BaseRenderer'
import _ from 'lodash'
import type OperationGroup from '../spec_parser/OperationGroup'
import { type Parameter, type RequestBody } from '../spec_parser/types'
import type Namespace from '../spec_parser/Namespace'

export default class FunctionRenderer extends BaseRenderer {
  protected templateFile = 'function.mustache'
  private readonly group: OperationGroup
  private readonly namespace: Namespace
  private readonly params: Record<string, Parameter | RequestBody>
  private readonly required_params: Set<string>

  constructor (group: OperationGroup, namespace: Namespace) {
    super()
    this.namespace = namespace
    this.group = group
    this.params = this.#params()
    this.required_params = new Set(_.entries(this.params).filter(([_, p]) => p.required).map(([name, _]) => name))
  }

  view (): Record<string, any> {
    return {
      method_description: this.group.description,
      reference: `{@link ${this.group.api_reference} - ${this.group.full_name}}`,
      doc_namespace: this.namespace.doc_namespace,
      params_container: this.required_params.size === 0 ? '[params]' : 'params',
      params_container_description: _.values(this.params).length === 0 ? ' - (Unused)' : undefined,
      parameter_descriptions: this.#parameter_descriptions(),
      function_signature: this.#function_signature(),
      path_components: this.#path_components(),
      http_verb: this.#http_verb(),
      return_type: '{{abort: function(), then: function(), catch: function()}|Promise<never>|*}',
      required_params: Array.from(this.required_params),
      path_params: _.keys(this.group.path_params),
      bulk_body: this.group.request_body?.bulk ?? false
    }
  }

  #function_signature (): string {
    if (this.namespace.root) return `function ${this.group.function_name} (params, options, callback)`
    return `${this.namespace.module_name}.prototype.${this.group.prototype_name} = function (params, options, callback)`
  }

  #params (): Record<string, Parameter | RequestBody> {
    const params: Record<string, Parameter | RequestBody> = { ...this.group.query_params, ...this.group.path_params }
    if (this.group.request_body) params.body = this.group.request_body
    return params
  }

  #parameter_descriptions (): Array<Record<string, any>> {
    return Object.values(this.params).map((p) => {
      return {
        type: `{${p.schema.type ?? 'string'}}`,
        jsdoc_name: p.required ? `params.${p.name}` : `[params.${p.name}${p.default == null ? '' : `=${p.default}`}]`,
        deprecated: p.deprecated,
        description: p.description ? `- ${p.description}` : ''
      }
    })
  }

  #path_components (): string {
    return this.group.url
      .split('/')
      .filter((c) => c !== '')
      .map((c) => c.startsWith('{') ? c.slice(1, -1) : `'${c}'`)
      .join(', ')
  }

  #http_verb (): string {
    const verbs = Array.from(this.group.http_verbs).sort()
    if (_.isEqual(verbs, ['GET', 'POST'])) return "body ? 'POST' : 'GET'"
    if (_.isEqual(verbs, ['POST', 'PUT'])) {
      const optional = (_.values(this.group.path_params)).find((p) => p.required)?.name
      return `${optional} === undefined ? 'POST' : 'PUT'`
    }
    return `'${verbs[0]}'`
  }
}
