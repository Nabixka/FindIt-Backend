const pool = require("./postgres")

async function createDB(){
    try{
        await pool.query(`
            CREATE DATABASE findit
        `)

        console.log("Berhasil Membuat Database")
    }
    catch(err){
        console.log(err)
    }
}

module.exports = createDB