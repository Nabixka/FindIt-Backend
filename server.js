require("dotenv").config()
const express = require("express")
const app = express()
const bearerToken = require("express-bearer-token")
const cors = require('cors')
const port = process.env.PORT
const userRouter = require("./routers/UserRouter")
const itemRouter = require("./routers/ItemRouter")
const authRouter = require("./routers/AuthRouter")

app.use(express.json())
app.use(bearerToken())
app.use(cors())
app.use("/uploads", express.static("uploads"))
app.use("/user", userRouter)
app.use("/item", itemRouter)
app.use("/auth", authRouter)

app.listen(port, () => {
    console.log(`SERVER BERJALAN di http://localhost:${port}`)
})