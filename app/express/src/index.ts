import 'express-session'
import { Roles } from './types'
import app from './config/server'

const PORT = process.env.PORT ?? 3000

declare module 'express-session' {
  interface SessionData {
    userId: string | null,
    role: Roles | null
  }
}

app.listen(PORT, () => {
  console.log(`express running on port ${PORT}`)
})
