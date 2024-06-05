/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

import Mustache from 'mustache'
import fs from 'fs'
import path from 'path'

export default class BaseRenderer {
  protected templateFile: string = ''
  view (): Record<string, any> {
    throw Error('Not implemented')
  }

  render (): string {
    const template_path = path.join(__dirname, './templates', this.templateFile)
    const template = fs.readFileSync(template_path, 'utf8')
    return Mustache.render(template, { ...this.#commons(), ...this.view() })
  }

  #commons (): Record<string, any> {
    return {
      opensearch_license:
`/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */
`,
      generated_code_warning:
`/*
 * This file was generated from OpenSearch API Spec. Do not edit it
 * manually. If you want to make changes, either update the spec or
 * the API generator.
 */`
    }
  }
}
