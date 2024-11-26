import { instance } from "../utils/Razorpay.js";
import { courseEnrollmentEmail } from "../mail/templates/courseEnrollmentEmail.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Course } from "../modules/courses.model.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import mailSender from "../utils/MainSender.js";
import { User } from "../modules/user.models.js";
import { CourseProgress } from "../modules/coursesProgress.model.js";
import { paymentSuccessEmail } from "../mail/templates/paymentSuccessfullEmail.js";
import crypto from "crypto";

const capturePayment = asyncHandler(async (req, res) => {
    const { courses } = req.body;
    console.log(courses);

    const userId = req.user._id;

    if (!courses) {
        throw new ApiError(404, "course ids required");
    }

    let totalAmount = 0;
    for (const course of courses) {
        const courseDetails = await Course.findById(course);

        if (!courseDetails) {
            throw new ApiError(404, "Course not found");
        }

        const uid = new mongoose.Types.ObjectId(userId);

        if (courseDetails.studentsEnrolled.includes(uid)) {
            throw new ApiError(404, "Student Already enrolled");
        }

        totalAmount += parseInt(courseDetails.price);
    }

    console.log("Total Amount of the courses -> ", totalAmount);
    const currency = "INR";

    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        // notes: {
        //     couseId: courses,
        //     userId
        // }
    }

    const paymentResponse = await instance.orders.create(options);
    // console.log(paymentResponse);

    if (!paymentResponse) {
        throw new ApiError(404, "Error occured during payment");
    }

    return res.status(200).json(
        new ApiResponse(200, paymentResponse, "Payment Successfully done you buyed a course")
    )

});

// verify Signature of Razorpay and server
const verifySignature = asyncHandler(async (req, res) => {
    // console.log("request in paymentVerify ->", req.body);

    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user?._id;
    console.log(courses);
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
        throw new ApiError(404, "Payment Failed");
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.Hmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");

    // console.log(expectedSignature+" "+razorpay_signature);
    if (expectedSignature === razorpay_signature) {
        let enrolledCourse; // Declare outside the loop
        let enrolledStudent; // Declare outside the loop
        let emailResponse;
        let courseProgressdetails;
        for (const course of courses) {
            enrolledCourse = await Course.findOneAndUpdate(
                { _id: course },
                {
                    $push: {
                        studentsEnrolled: userId,
                    }
                },
                { new: true }
            )
            if (!enrolledCourse) {
                throw new ApiError(404, "Error in enrolling course");
            }

            courseProgressdetails = await CourseProgress.create({
                courseId: course,
                userId: userId,
                completedVideos: [],
            })

            if (!courseProgressdetails) {
                throw new ApiError(404, "Error in creating course progress");
            }

            enrolledStudent = await User.findOneAndUpdate(
                {
                    _id: userId
                }, {
                $push: {
                    courses: course,
                    courseProgress: courseProgressdetails._id
                }
            }, {
                new: true
            }
            )

            if (!enrolledStudent) {
                throw new ApiError(404, "Error in enrolling Student");
            }
            emailResponse = await mailSender(enrolledStudent.email,
                "Congratulations, you are onboarded into new Ed4U Course",
                courseEnrollmentEmail(enrolledCourse.courseName, enrolledStudent.fullName)
            );

            if (!emailResponse) {
                throw new ApiError(404, "Error in Sending email Response");
            }

        }
        return res.status(200).json(
            new ApiResponse(200, { course: enrolledCourse, student: enrolledStudent, emailres: emailResponse },
                "Student Enrolled in course successfully")
        )
    }
})

const sendPaymentSuccessEmail = asyncHandler(async (req, res) => {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user._id;

    if (!userId || !orderId || !paymentId || !amount) {
        throw new ApiError(404, "User not found");
    }

    const user = await User.findOne({ _id: userId });
    const emailRes = await mailSender(user.email, "Payment Recived",
        paymentSuccessEmail(user.fullName, amount / 100, orderId, paymentId));

    if (!emailRes) {
        throw new ApiError(404, "Error in sending payment Successfully Email");
    }

    return res.status(200).json(
        new ApiResponse(200, emailRes, "Payment Successfull Email Sent")
    )
})

// const verifySignature = asyncHandler(async (req, res) => {

//     const webhookSecret = "12345678";

//     const signature = req.headers["x-razorpay-signature"];

//     const shasum = crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JONS.stringify(req.body));
//     const digest = shasum.digest("hex");

//     console.log("Signature -> ",signature,"digest -> ",digest);

//     if (signature === digest) {
//         console.log("Payment is Authorised");

//         const { courseId, userId } = req.body.payload.payment.entity.notes;


//         const enrolledCourse = await Course.findOneAndUpdate(
//             {
//                 _id: courseId
//             }, {
//             $push: {
//                 studentsEnrolled: userId,
//             }
//         }, {
//             new: true,
//         }
//         )

//         if (!enrolledCourse) {
//             throw new ApiError(404, "Error in enrolling course");
//         }

//         const enrolledStudent = await User.findOneAndUpdate(
//             {
//                 _id: userId
//             }, {
//             $push: {
//                 courses: courseId
//             }
//         }, {
//             new: true
//         }
//         )

//         if (!enrolledCourse) {
//             throw new ApiError(404, "Error in enrolling Student");
//         }

//         const emailResponse = await mailSender(enrolledStudent.email,
//             "Congratulations, you are onboarded into new Ed4U Course",
//             courseEnrollmentEmail
//         );

//         if (!emailResponse) {
//             throw new ApiError(404, "Error in Sending email Response");
//         }

//         return res.status(200).json(
//             new ApiResponse(200, { course: enrolledCourse, student: enrolledStudent, emailres: emailResponse },
//                 "Student Enrolled in course successfully")
//         )
//     } else {
//         throw new ApiError(404, "Invalid Request Signature not match");
//     }
// })



export {
    capturePayment,
    verifySignature,
    sendPaymentSuccessEmail

}