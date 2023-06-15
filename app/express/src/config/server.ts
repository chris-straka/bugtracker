import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import session from './session'
import routes from '../routes'
import { errorHandler } from '../middleware/errorHandler'

const app = express()

app.use(express.json())
app.use(session)
app.use(routes)
app.use(errorHandler)

export default app
