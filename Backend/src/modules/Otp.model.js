import mongoose, { Schema } from "mongoose";
import mailSender from "../utils/MainSender.js";
import { otpTemplate } from "../mail/templates/emailVerificationTemplate.js";
const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default:Date.now(),
    },
    expiresAt: {
        type: Date,
        default:Date.now() + 20*60*1000
    }
})

OtpSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

async function sendVerificationEmail(email, otp) {
    try {
        // const body= `<p>Enter the OTP to verify your email address</p><p>OTP: <b>${otp}</b></p>
        // <p>OTP Expires in 2 Minutes</p>`;
        const body= otpTemplate(otp);
        const mailResponse = await mailSender(email, "Verification Email from Ed4U", body);
        // console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
        console.log("Error occured while sending mails: ", error);
        throw error;
    }
}

const OtpValidation = mongoose.model("OtpValidation", OtpSchema);
export default OtpValidation;

