const express = require("express")
const router = express.Router()
const authController = require("../controllers/AuthController")

// Register
router.post("/register", authController.createUser)

// OTP
router.post("/otp/send", authController.sendOtpCode)
router.post("/otp/verify", authController.verifyOtp)

// Login
router.post("/login", authController.loginUser)
router.post("/login/verify", authController.verifyLoginOtp)

// Forgot Password
router.put("/forgot/password", authController.forgetPassword)

module.exports = router