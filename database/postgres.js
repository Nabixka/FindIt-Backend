const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER, 
    database: "postgres"
})

module.exports = pool