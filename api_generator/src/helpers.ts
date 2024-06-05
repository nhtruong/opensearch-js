/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type RawOpenSearchSpec } from './spec_parser/types'

export function resolve_ref (ref: string, root: Record<string, any>): any {
  const paths = ref.replace('#/', '').split('/')
  for (const p of paths) {
    root = root[p]
    if (root === undefined) break
  }
  return root
}

export function resolve_obj (obj: any, root: RawOpenSearchSpec): any | undefined {
  if (obj === undefined) return undefined
  if (obj.$ref == null) return obj
  else return resolve_ref(obj.$ref as string, root)
}
