/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

/*
 * This file was generated from OpenSearch API Spec. Do not edit it
 * manually. If you want to make changes, either update the spec or
 * the API generator.
 */

'use strict'

const { normalizeArguments, parsePathParam, handleMissingParam } = require('../utils');

/**
 * Delete a specified action group.
 * <br/> See Also: {@link https://opensearch.org/docs/latest/security/access-control/api/#delete-action-group - security.delete_action_group}
 *
 * @memberOf API-Security
 *
 * @param {object} params
 * @param {string} params.action_group - Action group to delete.
 *
 * @param {TransportRequestOptions} [options] - Options for {@link Transport#request}
 * @param {function} [callback] - Callback that handles errors and response
 *
 * @returns {{abort: function(), then: function(), catch: function()}|Promise<never>|*}
 */
function deleteActionGroupFunc(params, options, callback) {
  [params, options, callback] = normalizeArguments(params, options, callback);
  if (params.action_group == null) return handleMissingParam('action_group', this, callback);

  let { body, action_group, ...querystring } = params;
  action_group = parsePathParam(action_group);

  const path = '/_plugins/_security/api/actiongroups/' + action_group;
  const method = 'DELETE';
  body = body || '';

  return this.transport.request({ method, path, querystring, body }, options, callback);
}

module.exports = deleteActionGroupFunc;