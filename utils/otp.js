const { Resend } = require("resend")

const resend = new Resend(process.env.RESEND_API_KEY)

exports.sendOTP = async (to, otp) => {
    try{
        const response = await resend.emails.send({
            from: "FindIt",
            to: `${to}`,
            subject: "Kode OTP Anda",
            text: `Kode OTP Anda Adalah ${otp}. Berlaku 5 Menit`
        })
    }
    catch(err){
        console.log(err)
    }
}

exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}