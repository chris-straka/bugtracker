import { readFileSync } from 'node:fs'
import path from 'node:path'
import { parse } from 'yaml'
import SwaggerParser from '@apidevtools/swagger-parser'
import type { OpenAPIV3 } from 'openapi-types'
import request from 'supertest'
import app from '../../config/server'

const SPEC_PATH = path.resolve(__dirname, '../../../docs/openapi.yaml')
const METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const

type Layer = {
  route?: { path: string; methods: Record<string, boolean> }
  handle?: { stack?: Layer[] }
}

/** Every `METHOD /path` the Express app actually serves, in OpenAPI form
 * (`:id` -> `{id}`). Walks nested routers; all routes are declared with
 * absolute paths, so no prefix joining is needed. */
function expressOperations(): Set<string> {
  const ops = new Set<string>()
  const walk = (stack: Layer[]) => {
    for (const layer of stack) {
      if (layer.route) {
        const p = layer.route.path.replace(/:(\w+)/g, '{$1}')
        for (const [m, on] of Object.entries(layer.route.methods)) {
          if (on && m !== '_all') ops.add(`${m.toUpperCase()} ${p}`)
        }
      } else if (layer.handle?.stack) {
        walk(layer.handle.stack)
      }
    }
  }
  walk((app as unknown as { router: { stack: Layer[] } }).router.stack)
  return ops
}

function specOperations(spec: OpenAPIV3.Document): Set<string> {
  const ops = new Set<string>()
  for (const [p, item] of Object.entries(spec.paths)) {
    for (const m of METHODS) if (item?.[m]) ops.add(`${m.toUpperCase()} ${p}`)
  }
  return ops
}

// Routes that are infrastructure, not part of the documented API surface.
const UNDOCUMENTED = new Set(['GET /docs', 'GET /openapi.json'])

describe('OpenAPI spec (docs/openapi.yaml)', () => {
  const spec = parse(readFileSync(SPEC_PATH, 'utf8')) as OpenAPIV3.Document

  it('is a valid OpenAPI 3 document', async () => {
    await expect(SwaggerParser.validate(structuredClone(spec) as never)).resolves.toBeTruthy()
  })

  it('documents every route the app serves', () => {
    const documented = specOperations(spec)
    const missing = [...expressOperations()].filter(
      (op) => !documented.has(op) && !UNDOCUMENTED.has(op) && !op.startsWith('GET /docs'),
    )
    expect(missing).toEqual([])
  })

  it('documents no route the app does not serve', () => {
    const served = expressOperations()
    const stale = [...specOperations(spec)].filter((op) => !served.has(op))
    expect(stale).toEqual([])
  })

  it('declares path parameters for every {param} in a path', () => {
    const problems: string[] = []
    for (const [p, item] of Object.entries(spec.paths)) {
      const names = [...p.matchAll(/\{(\w+)\}/g)].map((m) => m[1])
      for (const m of METHODS) {
        const op = item?.[m]
        if (!op) continue
        const params = [...(item.parameters ?? []), ...(op.parameters ?? [])] as OpenAPIV3.ParameterObject[]
        for (const n of names) {
          const declared = params.some((x) => ('$ref' in x ? (x.$ref as string).endsWith(n) : x.name === n))
          if (!declared) problems.push(`${m.toUpperCase()} ${p}: {${n}}`)
        }
      }
    }
    expect(problems).toEqual([])
  })

  it('is served as JSON at /openapi.json', async () => {
    const res = await request(app).get('/openapi.json')
    expect(res.status).toBe(200)
    expect(res.body.openapi).toMatch(/^3\./)
    expect(Object.keys(res.body.paths).length).toBe(Object.keys(spec.paths).length)
  })

  it('serves Swagger UI at /docs', async () => {
    const page = await request(app).get('/docs/')
    expect(page.status).toBe(200)
    expect(page.text).toContain('swagger-ui')
    const init = await request(app).get('/docs/swagger-ui-init.js')
    expect(init.status).toBe(200)
    expect(init.text).toContain('Bugtracker API')
  })
})
