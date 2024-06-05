/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

import Generator from './Generator'
import FunctionFileRenderer from './renderers/FunctionFileRenderer'
import ModuleFileRenderer from './renderers/ModuleFileRenderer'
import IndexFileRenderer from './renderers/IndexFileRenderer'

const generator = new Generator('opensearch-openapi.yaml', 'path/to/output')

const ns = generator.namespaces.rollups
const func_file = new FunctionFileRenderer(ns.operation_groups.explain, ns)
console.log(func_file.render())

const mod_file = new ModuleFileRenderer(ns)
console.log(mod_file.render())

const idx_file = new IndexFileRenderer(generator.namespaces)
console.log(idx_file.render())
