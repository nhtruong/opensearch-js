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
import * as Common from '../_types/_common'
import * as Global from '../_types/_global'
import * as Snapshot_VerifyRepository from '../_types/snapshot.verify_repository'

export interface Snapshot_VerifyRepository_Request extends Global.Params {
  cluster_manager_timeout?: Common.Duration;
  master_timeout?: Common.Duration;
  repository: Common.Name;
  timeout?: Common.Duration;
}

export interface Snapshot_VerifyRepository_Response extends ApiResponse {
  body: Snapshot_VerifyRepository_ResponseBody;
}

export interface Snapshot_VerifyRepository_ResponseBody {
  nodes: Record<string, Snapshot_VerifyRepository.CompactNodeInfo>;
}
