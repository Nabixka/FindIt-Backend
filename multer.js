const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        console.log("Base URL: ", req.baseUrl)
        console.log("FIeldname : ", file.fieldname)

        let folder = "uploads"
        if(file.fieldname === "image" && req.baseUrl.includes("item")){
            folder = "uploads/items"
        }
        if(file.fieldname === "proof" && req.baseUrl.includes("user")){
            folder = "uploads/report"
        }

        cb(null, folder)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const uploadItems = multer({
    storage
})

const uploadReport = multer({
    storage
})

module.exports = { uploadItems, uploadReport }