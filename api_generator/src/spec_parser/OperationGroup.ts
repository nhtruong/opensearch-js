/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import type * as type from './types'
import _ from 'lodash'

export default class OperationGroup {
  readonly operations: type.Operation[]

  readonly name: string
  readonly full_name: string
  readonly url: string
  readonly http_verbs: Set<string>
  readonly description: string
  readonly api_reference: string | undefined
  readonly path_params: Record<string, type.Parameter>
  readonly query_params: Record<string, type.Parameter>
  readonly request_body: type.RequestBody | undefined
  readonly response_body: type.ResponseBody | undefined
  readonly function_name: string | undefined
  readonly prototype_name: string

  constructor (operations: type.Operation[], root: boolean) {
    this.operations = operations
    this.full_name = operations[0].full_name
    this.name = operations[0].group
    this.url = _.maxBy(operations, (o) => o.url.length)?.url ?? ''
    this.path_params = this.#path_params(operations)
    this.query_params = this.#query_params(operations)
    this.http_verbs = new Set(operations.map((o) => o.http_verb.toUpperCase()))
    this.request_body = operations[0].request_body
    this.response_body = operations[0].response_body
    this.description = operations[0].description
    this.api_reference = operations[0].api_reference
    this.function_name = root ? `${this.name}Api` : undefined
    this.prototype_name = _.camelCase(this.name)
  }

  #query_params (operations: type.Operation[]): Record<string, type.Parameter> {
    return operations[0].parameters
      .filter((p) => p.in === 'query')
      .reduce((a, b) => ({ ...a, [b.name]: b }), {})
  }

  // Operations of the same group can have different sets of path parameters.
  // Only the path parameters that are common to all operations are required.
  #path_params (operations: type.Operation[]): Record<string, type.Parameter> {
    const path_params: Record<string, type.Parameter> = {}
    const universal_path_params = new Set<string>(operations.map((o) => {
      const params = o.parameters.filter((p) => p.in === 'path')
      for (const param of params) path_params[param.name] = param
      return params.map((p) => p.name)
    }).reduce((a, b) => _.intersection(b, a)))
    for (const name of universal_path_params) path_params[name].required = true
    return path_params
  }
}
