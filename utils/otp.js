const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

exports.sendOTP = async (to, otp) => {
    await transporter.sendMail({
        from: `"Kode OTP" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Kode OTP Anda",
        text: `Kode OTP Anda Adalah ${otp}. Berlaku 5 Menit`
    })
}

exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}