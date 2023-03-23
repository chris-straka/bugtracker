import app from "./config/server"

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("express running on port " + PORT)
})

export default app