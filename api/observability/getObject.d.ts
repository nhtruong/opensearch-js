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
import * as Observability_Common from '../_types/observability._common'

export interface Observability_GetObject_Request extends Global.Params {
  object_id: string;
}

export interface Observability_GetObject_Response extends ApiResponse {
  body: Observability_GetObject_ResponseBody;
}

export type Observability_GetObject_ResponseBody = Observability_Common.ObservabilityObjectList
