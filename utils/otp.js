const { Resend } = require("resend")
const nodemailer = require("nodemailer")

const resend = new Resend(process.env.RESEND_API_KEY)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

if (process.env.MODE === "dev") {
    exports.sendOTP = async (to, otp) => {
        await transporter.sendMail({
            from: `"Findit" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: "Kode OTP",
            text: `Berlaku untuk 5 Menit: ${otp}`
        })
    }
}
else {
    exports.sendOTP = async (to, otp) => {
        await resend.emails.send({
            from: "Findit <onboarding@resend.dev>",
            to: to,
            subject: "Kode OTP Anda",
            text: `Kode OTP Anda Adalah ${otp}. Berlaku 5 Menit`
        })
    }
}

exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}