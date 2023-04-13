import 'express-session'
// import './types'
import app from './config/server'

const PORT = process.env.PORT ?? 3000

app.get('/foo', (req, res) => {
  res.send(process.env.PGHOST)
})

app.listen(PORT, () => {
  console.log(`express running on port ${PORT}`)
})
