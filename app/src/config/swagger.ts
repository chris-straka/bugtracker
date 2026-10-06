import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { parse } from 'yaml'

// docs/openapi.yaml is the hand-written contract; src/__test__/docs/openapi.test.ts
// fails if it drifts from the routes. Dev and tests run from src/config; the prod
// image flattens build/ into the workdir and copies docs/ beside it.
const SPEC_PATH = [
  path.resolve(__dirname, '../../docs/openapi.yaml'),
  path.resolve(__dirname, '../docs/openapi.yaml'),
].find((p) => existsSync(p)) as string

export const openApiSpec = parse(readFileSync(SPEC_PATH, 'utf8')) as Record<string, unknown>

const router = Router()

router.get('/openapi.json', (_req, res) => {
  res.json(openApiSpec)
})
router.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec))

export default router
