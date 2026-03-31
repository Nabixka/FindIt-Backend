const express = require("express")
const router = express.Router()
const userController = require("../controllers/UserController")
const auth = require("../middlewares/auth")
const cekRole = require("../middlewares/cekRole")
const { uploadReport } = require("../multer")

// Profil
router.get("/profil", auth, userController.getProfil)

// Get All User
router.get("/", userController.getUser)

// Laporan Pengguna Usil
router.get("/report", userController.getReport)
router.get("/report/:id", userController.getReportById)
router.post("/report", uploadReport.single("proof"), userController.createReport)

// Update Status User 
router.put("/status/:id", userController.updateStatusUser)

// Get And Delete ById
router.get("/:id", auth, userController.getUserById)
router.delete("/:id", auth, cekRole, userController.deleteUser )


module.exports = router