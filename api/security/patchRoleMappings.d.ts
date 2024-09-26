/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 */

/*
 * This file was generated from the OpenSearch API Spec. Do NOT edit it
 * manually. If you want to make changes, either update the spec or
 * modify the API generator.
 */

import { ApiResponse } from '../../lib/Transport'
import * as Global from '../_types/_global'
import * as Security_Common from '../_types/security._common'

export interface Security_PatchRoleMappings_Request extends Global.Params {
  body: Security_PatchRoleMappings_RequestBody;
}

export type Security_PatchRoleMappings_RequestBody = Security_Common.PatchOperation[]

export interface Security_PatchRoleMappings_Response extends ApiResponse {
  body: Security_PatchRoleMappings_ResponseBody;
}

export type Security_PatchRoleMappings_ResponseBody = Security_Common.Ok
