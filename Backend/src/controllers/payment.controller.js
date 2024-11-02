import { instance } from "../utils/Razorpay.js";
import { courseEnrollmentEmail } from "../mail/templates/courseEnrollmentEmail.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Course } from "../modules/courses.model.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import mailSender from "../utils/MainSender.js";

const capturePayment = asyncHandler(async (req, res) => {
    const { course_Id } = req.body;

    const userId = req.user._id;

    if (!course_Id) {
        throw new ApiError(401, "course id required");
    }

    const courseDetails = await Course.findById(course_Id);

    if (!courseDetails) {
        throw new ApiError(401, "Course not found");
    }

    const uid = new mongoose.Types.ObjectId(userId);

    if (courseDetails.studentsEnrolled.includes(uid)) {
        throw new ApiError(401, "Student Already enrolled");
    }

    const amount = courseDetails.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            couseId: course_Id,
            userId
        }
    }

    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);

    if (!paymentResponse) {
        throw new ApiError(401, "Error occured during payment");
    }

    return res.status(200).json(
        new ApiResponse(200, { payment: paymentResponse, courseBuyed: courseDetails }, "Payment Successfully done you buyed a course")
    )

});

// verify Signature of Razorpay and server
const verifySignature = asyncHandler(async (req, res) => {

    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JONS.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature === digest) {
        console.log("Payment is Authorised");

        const { courseId, userId } = req.body.payload.payment.entity.notes;

        const enrolledCourse = await Course.findOneAndUpdate(
            {
                _id: courseId
            }, {
            $push: {
                studentsEnrolled: userId,
            }
        }, {
            new: true,
        }
        )

        if (!enrolledCourse) {
            throw new ApiError(401, "Error in enrolling course");
        }

        const enrolledStudent = await User.findOneAndUpdate(
            {
                _id: userId
            }, {
            $push: {
                courses: courseId
            }
        }, {
            new: true
        }
        )

        if (!enrolledCourse) {
            throw new ApiError(401, "Error in enrolling Student");
        }

        const emailResponse = await mailSender(enrolledStudent.email,
            "Congratulations, you are onboarded into new Ed4U Course",
            courseEnrollmentEmail
        );

        if (!emailResponse){
            throw new ApiError(401,"Error in Sending email Response");
        }

        return res.status(200).json(
            new ApiResponse(200,{course:enrolledCourse,student:enrolledStudent,emailres:emailResponse},
                "Student Enrolled in course successfully")
        )
    }else{
        throw new ApiError(401,"Invalid Request Signature not match");
    }
})

export {
    capturePayment,
    verifySignature
}