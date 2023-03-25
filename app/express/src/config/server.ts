/* eslint-disable import/first */
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import sessions from './session'
import routes from '../routes'

const app = express()

app.use(express.json())
app.use(sessions)
app.use(routes)

export default app
