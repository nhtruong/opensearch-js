/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import Generator from './Generator'
import ModuleFileRenderer from './legacy_file_renderers/ModuleFileRenderer'
import FunctionTypeRenderer from './legacy_file_renderers/FunctionTypeRenderer'

const generator = new Generator('opensearch-openapi.yaml', 'path/to/output')

const ns = generator.namespaces.rollups
const mod = new ModuleFileRenderer(ns)
console.log(mod.render())

const func_type = new FunctionTypeRenderer(ns)
console.log(func_type.render())
