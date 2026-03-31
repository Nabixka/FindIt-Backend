const { Resend } = require("resend")

const resend = new Resend(process.env.RESEND_API_KEY)

exports.sendOTP = async (to, otp) => {
    await resend.emails.send({
        from: "Findit <onboarding@resend.dev>",
        to: to,
        subject: "Kode OTP Anda",
        text: `Kode OTP Anda Adalah ${otp}. Berlaku 5 Menit`
    })
}

exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}