import { Category } from "../modules/category.model.js";
import { Course } from "../modules/courses.model.js";
import { User } from "../modules/user.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createCourse = asyncHandler(async (req, res) => {

    const { courseName, courseDescription, whatYouWillLearn, price, tag, category } = req.body;

    // console.log(courseName, courseDescription, whatYouWillLearn, price, tag, category);
    if (!(courseName || courseDescription || whatYouWillLearn || price || tag || category)) {
        throw new ApiError(401, "all fields are required")
    }

    const thumbnail = req.file?.path;
    // console.log(thumbnail);

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User Instructor are not found");
    }

    const categoryDetails = await Category.findById(category);

    if (!categoryDetails) {
        throw new ApiError(401, "categoryDetails are not found");
    }

    const uploadImage = await uploadOnCloudinary(thumbnail, process.env.CLOUDINARY_FOLDER_NAME);

    if (!uploadImage) {
        throw new ApiError(401, "error in uploading image to cloudinary");
    }

    const newCourse = await Course.create({
        courseName,
        courseDescription,
        whatYouWillLearn,
        price,
        instructor: userId,
        category: categoryDetails._id,
        tag,
        thumbnail: uploadImage.secure_url || "",
        // thumbnail: "",
    })

    if (!newCourse) {
        throw new ApiError(401, "Error in creating course in DB");
    }

    await Category.findByIdAndUpdate(
        {
            _id:category,
        },
        {
            $push:{
                course:newCourse._id
            }
        },{
            new:true,
        }
    )

    await User.findByIdAndUpdate({
        _id: userId
    }, {
        $push: {
            courses: newCourse._id
        }
    }, {
        new: true
    })

    return res.status(200).json(
        new ApiResponse(200, newCourse, "course successfully created")
    )
})

const getAllCourses = asyncHandler(async (req, rs) => {
    const getCourseData = await Course.find({}, {
        courseName: true,
        instructor: true,
        price: true,
        thumbnail: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
    }).populate("instructor").populate("courseContent").exec();

    return res.status(200).json(
        new ApiResponse(200, getCourseData, "All courses fetched successfully")
    )
})

const getCourseDetails = asyncHandler(async (req, res) => {

    const { courseId } = req.body;

    if (!courseId) {
        throw new ApiError(401, "Required Course id field");
    }

    const courseDetails = await Course.findById(courseId).
        populate(
            {
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                }
            }
        )
        .populate("category")
        // .populate("ratingAndReviews")
        .populate(
            {
                path: "courseContent",
                populate: {
                    path: "subsection",
                }
            }
        ).exec();

    if (!courseDetails) {
        throw new ApiError(401, "Course Details not found");
    }

    return res.status(200).json(
        new ApiResponse(200, courseDetails, "course details fetched successfully")
    )
})

export {
    createCourse,
    getAllCourses,
    getCourseDetails
}