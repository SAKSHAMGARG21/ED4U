import { RatingAndReview } from "../modules/ratingandreviews.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../modules/courses.model.js";
import mongoose from "mongoose";

const createRatingAndReviews = asyncHandler(async (req, res) => {

    const { userId } = req.user._id;
    if (!userId) {
        throw new ApiError(401, "User not logged in");
    }
    const { courseId, rating, review } = req.body;

    if (!(courseId || rating || review)) {
        throw new ApiError(401, "all fields are Required");
    }

    const userEnrolledornot = await Course.findById(courseId);
    if (!userEnrolledornot) {
        throw new ApiError(401, "course not found");
    }

    if (!userEnrolledornot.studentsEnrolled.includes(userId)) {
        throw new ApiError(401, "Student not enrolled for this course. Please Enrolle in course to review");
    }

    if (!userEnrolledornot.ratingAndReviews.includes(userId)) {
        throw new ApiError(401, "Student Already Reviewed this course");
    }

    const newRatingAndReview = await RatingAndReview.create({
        rating,
        review,
        user: userId,
        course: courseId
    })

    if (!newRatingAndReview) {
        throw new ApiError(401, "Error in creating new Rating and Review");
    }

    const updatedCourse = await Course.findByIdAndUpdate(
        {
            _id: courseId
        }, {
        $push: {
            ratingAndReviews: newRatingAndReview._id
        }
    }, {
        new: true,
    }
    )

    if (!updatedCourse) {
        throw new ApiError(401, "New Rating and Review not update");
    }

    return res.status(200).json(
        new ApiResponse(200, newRatingAndReview, "Rating and Review successfully created")
    )
})



// const getAverageRating = asyncHandler(async (req, res) => {

//     const { courseId } = req.body;
//     const course = await Course.findById(courseId);
//     if (!courseId) {
//         throw new ApiError(401, "Course not found");
//     }

//     let Totalcount = course.ratingAndReviews.length;

//     let sum = 0;

//     for (const element of course.ratingAndReviews) {
//         sum += element.rating;
//     }

//     let avgRating = sum / Totalcount;

//     for (const element of course.ratingAndReviews) {
//         const avgRatingcourses = await Course.find(
//             {
//                 _id:{
//                     $eq:element._id
//                 }
//             },
//             {
//                 rating:{
//                     $gt:avgRating
//                 }
//             }
//         )
//     }

//     return res.status(200).json(
//         new ApiResponse(200, {avgRating:avgRating, avgRatingCourse:avgRatingCourse}, "Average Rating fetched ")
//     )

// })
const getAverageRating = asyncHandler(async (req, res) => {

    const courseId = req.body.courseId;

    const result = await RatingAndReview.aggregate([

        {
            $match: new mongoose.Types.ObjectId(courseId)
        },
        {
            $group: {
                _id: null,
                averageRating: { $avg: "$rating" }
            }
        }
    ])

    if (result.length > 0) {
        return res.status(200).json(
            new ApiResponse(200, result[0].averageRating, "Average Rating fetched ")
        )
    }
    else {
        return res.status(401).json(
            new ApiResponse(401, 0, "Average Rating not fetched ")
        )
    }
})

const getAllRating = asyncHandler(async (req, res) => {

    const allRatings = await RatingAndReview.find({})
        .sort({ rating: "desc" })
        .populate({
            path: "User",
            select: "userName fullName email avtar"
        }).populate({
            path: "Course",
            select: "courseName"
        }).exec();

    if (!allRatings) {
        throw new ApiError(401, "all Rating not found");
    }

    return res.status(200).json(
        new ApiResponse(200, allRatings, "All Rating Fetched successfully")
    )
})

export {
    createRatingAndReviews,
    getAverageRating,
    getAllRating,
}