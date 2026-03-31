const user = require("../models/UserModel")
const auth = require("../models/AuthModel")
const pool = require("../database/db")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const { generateOTP, sendOTP } = require("../utils/otp")

// Kirim Kode OTP
exports.sendOtpCode = async (req, res) => {
    try{
        const { email } = req.body
        if(!email){
            return res.status(400).json({
                status: 400,
                message: "Email Wajib Diisi"
            })
        }

        const exist = await user.getUserByEmail(email)
        if(!exist){
            return res.status(404).json({
                status: 404,
                message: "Email Tidak Terdaftar"
            })
        }

        const otp = generateOTP()
        const expired = Date.now() + 5 * 60 * 1000

        await pool.query(`
            UPDATE users SET otp_code = $1, otp_expired = $2 WHERE email = $3`,
        [otp, expired, email])

        await sendOTP(email, otp)

        res.json({
            message: "Kode OTP Berhasil dikirim"
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

// Verifikasi Kode OTP
exports.verifyOtp = async (req, res) => {
    try{
        const { email, otp } = req.body

        const result =  await user.getUserByEmail(email)
        if(!result){
            return res.status(404).json({
                status: 404,
                message: "Email Tidak Terdaftar"
            })
        }

        if(!result.otp_code || Date.now() > result.otp_expired){
            return res.status(400).json({
                status: 400,
                message: "Kode OTP Kadaluarsa"
            })
        }

        if(otp !== result.otp_code){
            return res.status(400).json({
                status: 400,
                message: "Kote OTP Tidak Sesuai"
            })
        }

        await pool.query(`
            UPDATE users SET otp_code = NULL, otp_expired = NULL, is_verified = true WHERE email = $1`,
        [email])

        res.status(200).json({
            status: 200,
            message: "Kode OTP Benar"
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

// Forgot Password
exports.forgetPassword = async (req, res) => {
    try{
        const { email, password} = req.body
        
        if(!email || !password){
            return res.status(400).json({
                status: 400,
                message: "Bad Request"
            })
        }

        const exist = await user.getUserByEmail(email)
        if(!exist){
            return res.status(404).json({
                status: 404,
                message: "User Tidak Ada"
            })
        }

        const result = await auth.forgetPassword(email, password)
        res.status(200).json({
            status: 200,
            message: "success"
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

// Login
exports.loginUser = async (req, res) => {
    try{

        const { email, password } = req.body
        
        if(!email || !password){
            return res.status(400).json({
                status: 400,
                message: "Bad Request"
            })
        }
        
        const exist = await user.getUserByEmail(email)
        if(!exist){
            return res.status(404).json({
                status: 404,
                message: "Email Tidak Terdaftar"
            })
        }
        
        const matchPassword = await bcrypt.compare(password, exist.password)
        if(!matchPassword){
            return res.status(400).json({
                status: 400,
                message: "Password Salah"
            })
        }

        if(exist.status == "banned"){
            return res.status(403).json({
                status: 403,
                message: "AKun Telah DiBan"
            })
        }

        const otp = generateOTP()
        const expired = Date.now() + 5 * 60 * 1000

        await pool.query(`
            UPDATE users SET otp_code = $1, otp_expired = $2 WHERE email = $3`,
        [otp, expired, email])
        
        await sendOTP(email, otp)

        const result = await user.getUserById(exist.id)
        res.status(200).json({
            status: 200,
            message: "success",
            data: result
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

exports.verifyLoginOtp = async (req, res) => {
    try{
        const { email, otp } = req.body

        const result = await user.getUserByEmail(email)
        if(!result){
            return res.status(404).json({
                status: 404,
                message: "Email Tidak Terdaftar"
            })
        }

        if(otp != result.otp_code){
            return res.status(400).json({
                status: 400,
                message: "Kode OTP Tidak Sesuai"
            })
        }

        if(Date.now() > result.otp_expired){
            return res.status(400).json({
                status: 400,
                message: "Kode OTP Sudah Kadaluarsa"
            })
        }

        const token = crypto.randomBytes(32).toString("hex")

        await pool.query(`
            UPDATE users SET token = $1, otp_code = NULL, otp_expired = NULL WHERE email = $2`,
        [token, email])

        const data = await user.getUserById(result.id)

        res.status(200).json({
            status: 200,
            message: "Login Berhasil",
            data: data
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

// Create User
exports.createUser = async (req, res) => {
    try{
        const { username, email, password, role } = req.body
        if(!username || !email || !password || !role){
            return res.status(400).json({
                status: 400,
                message: "Bad Request"
            })
        }

        const exist = await user.getUserByEmail(email)
        if(exist){
            return res.status(409).json({
                status: 409,
                message: "Email Sudah Ada"
            })
        }

        const result = await auth.createUser({username, email, password, role})

        res.status(201).json({
            status: 201,
            message: "created",
            data: result
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}