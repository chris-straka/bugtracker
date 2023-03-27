import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
import { sessions } from "./config"
import routes from './routes'

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(sessions)
app.use(routes)

app.listen(PORT, () => {
  console.log("express running on port " + PORT)
})