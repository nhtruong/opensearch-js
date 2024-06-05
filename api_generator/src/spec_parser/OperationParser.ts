/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import type * as t from './types'
import { resolve_obj } from '../helpers'

export default class OperationParser {
  private readonly _doc: t.RawOpenSearchSpec
  readonly operations: t.Operation[]

  constructor (doc: t.RawOpenSearchSpec) {
    this._doc = doc
    this.operations = this.#from_document()
  }

  #from_document (): t.Operation[] {
    return Object.entries(this._doc.paths).flatMap(([url, path]) => this.#from_path(url, path))
  }

  #from_path (url: string, path: t.Path): t.Operation[] {
    return Object.entries(path).flatMap(([verb, raw]) => this.#from_raw_operation(url, verb, raw))
      .filter((o) => o) as t.Operation[]
  }

  #from_raw_operation (url: string, verb: string, raw: t.RawOperation): t.Operation | undefined {
    if (raw['x-ignorable']) return undefined
    const full_name = raw['x-operation-group']
    const [group, namespace] = full_name.split('.').reverse()
    return {
      namespace: namespace ?? '_core',
      full_name,
      group,
      url,
      http_verb: verb as t.HttpVerb,
      description: raw.description,
      api_reference: raw.externalDocs?.url,
      deprecated: raw.deprecated ?? false,
      deprecation_message: raw['x-deprecation-message'],
      parameters: raw.parameters.map((p) => this.#parameter(p)).filter((p) => p) as t.Parameter[],
      request_body: this.#request_body(raw.requestBody),
      response_body: this.#response_body(raw.responses)
    }
  }

  #parameter (raw: t.RefObject): t.Parameter | undefined {
    const raw_param: t.RawParameter = resolve_obj(raw, this._doc)
    if (raw_param['x-global']) return
    const schema = resolve_obj(raw_param.schema, this._doc) as t.Schema
    const description = [raw_param.description, schema.description].filter((d) => d).join('. ')
    const deprecated = raw_param.deprecated ?? false
    const default_value = raw_param.default ?? schema.default
    return { ...raw_param, description, schema, deprecated, default: default_value }
  }

  #request_body (raw: t.RefObject | undefined): t.RequestBody | undefined {
    const raw_body: t.RawRequestBody | undefined = resolve_obj(raw, this._doc)
    if (raw_body === undefined) return undefined
    const raw_schema = raw_body.content['application/json']?.schema ?? raw_body.content['application/x-ndjson']?.schema
    const schema: t.Schema | undefined = resolve_obj(raw_schema, this._doc)
    const bulk = raw_body.content['application/x-ndjson'] !== undefined
    if (schema === undefined) throw new Error('Request body schema not found')
    const description = raw_body.description ?? schema.description
    const required = raw_body.required ?? false
    return { schema, bulk, description, required, name: 'body', deprecated: false, default: undefined }
  }

  #response_body (responses: Record<string, t.RefObject>): t.ResponseBody | undefined {
    const raw_response: t.RefObject = responses['200'] ?? responses['201']
    const raw_body: t.RawResponseBody = resolve_obj(raw_response, this._doc)
    const raw_schema = raw_body.content?.['application/json']?.schema
    if (raw_schema === undefined) return
    const schema: t.Schema = resolve_obj(raw_schema, this._doc)
    return { schema, description: raw_body.description }
  }
}
