const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    family: 4
})

exports.sendOTP = async (to, otp) => {
    transporter.sendMail({
        from: `"Kode OTP" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Kode OTP Anda",
        text: `Kode OTP Anda Adalah ${otp}. Berlaku 5 Menit`
    }).then(info => {
        console.log("Email Dikirim: ", info.response)
    }).catch(err => {
        console.log("Email Error: ", err.message)
    })
}

exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}