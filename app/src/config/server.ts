import dotenv from 'dotenv'
dotenv.config({ quiet: true })
import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import session from './session'
import routes from '../routes'
import { errorHandler } from '../middleware/errorHandler'

const app = express()

app.use(helmet())
app.use(compression())
// Jest sets NODE_ENV=test; keep route-test output clean.
app.use(morgan('dev', { skip: () => process.env.NODE_ENV === 'test' }))
app.use(express.json())
app.use(session)
app.use(routes)
app.use(errorHandler)

export default app
