import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config({
    path: ".env"
})

const mailSender = async (email, title, body) => {
    try {
        const otpAuth = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.PASS_EMAIL
            }
        });

        let info = await otpAuth.sendMail({
            from: process.env.FROM_EMAIL,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })

        // console.log(info);
        
        // otpAuth.verify((error, success) => {
        //     if (error) {
        //         console.error("Error sending email:", error);
        //     } else {
        //         console.log("Server is ready for sent mails");
        //         console.log(success);
        //     }
        // });

        return info;

    } catch (error) {
        console.log("Error in sending mail", error.message);
    }
}

export default mailSender;