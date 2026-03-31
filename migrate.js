require("dotenv").config()
const createDB = require("./database/createDB")
const createTable = require("./database/createTable")
const userSeeder = require("./seeder/userSeeder")
const itemSeeder = require("./seeder/itemSeeder")

async function migrate(){
    try{
        await createDB()
        await createTable()
        await userSeeder()
        await itemSeeder()
    }
    catch(err){
        console.log(err)
    }
    finally{
        process.exit(0)
    }
}

migrate()