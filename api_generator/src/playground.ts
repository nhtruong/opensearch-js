/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

import Generator from './Generator'

const generator = new Generator('opensearch-openapi.yaml', '/Users/theotr/IdeaProjects/opensearch-js-base')

generator.generate()

// Memory usage:
//   RSS: 23.16 MB
//   Heap Total: 3.91 MB
//   Heap Used: 3.01 MB
//   External: 1.02 MB

// Memory usage:
//   RSS: 72.43 MB
//   Heap Total: 34.63 MB
//   Heap Used: 21.7 MB
//   External: 1.92 MB

// Memory usage:
//   RSS: 65.27 MB
//   Heap Total: 31.41 MB
//   Heap Used: 16.14 MB
//   External: 1.92 MB
