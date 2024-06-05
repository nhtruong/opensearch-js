/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import BaseRenderer from './BaseRenderer'
import type Namespace from '../components/Namespace'

export default class IndexRenderer extends BaseRenderer {
  protected templateFile = 'index.mustache'
  private readonly root_namespaces: Namespace[]
  private readonly leaf_namespaces: Namespace[]

  constructor (namespaces: Namespace[]) {
    super()
    this.root_namespaces = namespaces.filter((n) => n.root)
    this.leaf_namespaces = namespaces.filter((n) => !n.root)
  }

  view (): Record<string, any> {
    return {
      root_namespaces: this.#root_namespaces(),
      leaf_namespaces: this.#leaf_namespaces()
    }
  }

  #root_namespaces (): Array<Record<string, any>> {
    return this.root_namespaces.map((n) => {
      return {
        filename: n.filename,
        methods: n.methods.map((m) => {
          return {
            function_name: m.functionName,
            prototype_name: m.prototypeName
          }
        })
      }
    }).sort((a, b) => a.filename.localeCompare(b.filename))
  }

  #leaf_namespaces (): Array<Record<string, any>> {
    return this.leaf_namespaces.map((n) => {
      return {
        filename: n.filename,
        function_name: n.functionName,
        prototype_name: n.prototypeName,
        symbol_name: n.symbolName,
        symbol_desc: n.symbolDesc
      }
    }).concat({
      filename: 'http',
      function_name: 'HttpApi',
      prototype_name: 'http',
      symbol_name: 'kHttp',
      symbol_desc: 'Http'
    }).sort((a, b) => a.filename.localeCompare(b.filename))
  }
}
