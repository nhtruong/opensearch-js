/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import OperationGroup from './OperationGroup'
import { type Operation } from './types'
import _ from 'lodash'

export default class Namespace {
  readonly name: string
  readonly root: boolean
  readonly module_name: string
  readonly doc_namespace: string
  readonly prototype_name: string | undefined
  readonly operation_groups: Record<string, OperationGroup>

  constructor (name: string, operations: Operation[]) {
    this.name = name
    this.root = name === '_core'
    this.prototype_name = this.root ? undefined : _.camelCase(name)
    this.module_name = `${_.capitalize(_.camelCase(name))}Api`
    this.doc_namespace = this.root ? 'API-Core' : `API-${_.capitalize(_.kebabCase(name))}`
    this.operation_groups =
      _.fromPairs(
        _.entries(
          _.groupBy(operations, 'group'))
          .map(([group, ops]) => [group, new OperationGroup(ops, this.root)]))
  }
}
