import { Category } from "../modules/category.model.js";
import { Course } from "../modules/courses.model.js";
import { Section } from "../modules/Section.model.js";
import { Subsection } from "../modules/Subsection.model.js";
import { User } from "../modules/user.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { convertSecondsToDuration } from "../utils/secToDuration.js";

const createCourse = asyncHandler(async (req, res) => {

    const { courseName, courseDescription, whatWillYouLearn, price, tags, category, status, instructions } = req.body;

    // console.log(courseName, courseDescription, whatWillYouLearn, price, tags, category, status, instructions);
    if (!(courseName || courseDescription || whatWillYouLearn || price || tags || category || status || instructions)) {
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
    // console.log(uploadImage);

    if (!uploadImage) {
        throw new ApiError(401, "error in uploading image to cloudinary");
    }

    const newCourse = await Course.create({
        courseName,
        courseDescription,
        whatWillYouLearn,
        price,
        instructor: userId,
        category: categoryDetails._id,
        tag: tags,
        thumbnail: uploadImage.secure_url || "",
        status,
        instructions
    })

    if (!newCourse) {
        throw new ApiError(401, "Error in creating course in DB");
    }

    const newCourseAddedtoCategory = await Category.findByIdAndUpdate(
        {
            _id: category,
        },
        {
            $push: {
                courses: newCourse._id
            }
        }, {
        new: true,
    }
    )

    if (!newCourseAddedtoCategory) {
        throw new ApiError(404, "Error in adding course to category");
    }

    const newCourseAddedToUser = await User.findByIdAndUpdate({
        _id: userId
    }, {
        $push: {
            courses: newCourse._id
        }
    }, {
        new: true
    })

    if (!newCourseAddedToUser) {
        throw ApiError(404, "Error in adding course to User");
    }

    return res.status(200).json(
        new ApiResponse(200,
            newCourse,
            "course successfully created"
        )
    )
})

const getAllCourses = asyncHandler(async (req, res) => {
    // const getCourseData = await Course.find({}, {
    //     courseName: true,
    //     instructor: true,
    //     price: true,
    //     thumbnail: true,
    //     ratingAndReviews: true,
    //     studentsEnrolled: true,
    // }).populate("instructor").populate("courseContent").exec();
    const getCourseData = await Course.find({}).populate("instructor").populate("courseContent").exec();

    return res.status(200).json(
        new ApiResponse(200, getCourseData, "All courses fetched successfully")
    )
})

const getCourseDetails = asyncHandler(async (req, res) => {

    const { courseId } = req.body;

    // console.log(courseId);
    if (!courseId) {
        throw new ApiError(404, "Required Course id field");
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
        throw new ApiError(404, "Course Details not found");
    }


    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
        content.subsection.forEach((subsec) => {
            const timeDurationInSeconds = parseInt(subsec.timeDuration);
            totalDurationInSeconds += timeDurationInSeconds;
        });
    });
    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json(
        new ApiResponse(200, { courseDetails: courseDetails ,totalDuration:totalDuration}, "course details fetched successfully")
    )
})

const updateCourseDetails = asyncHandler(async (req, res) => {
    const { courseId, courseName, courseDescription, whatYouWillLearn, price, tag, category, status } = req.body;

    console.log(courseId, courseName, courseDescription, whatYouWillLearn, price, tag, status, category);
    // if (!(courseName || courseDescription || whatYouWillLearn || price || tag || category)) {
    //     throw new ApiError(401, "all fields are required")
    // }
    const coursetoUpdate = await Course.findById(courseId);
    if (!coursetoUpdate) {
        throw new ApiError(404, "course not found");
    }


    const thumbnail = req.file?.path;
    // console.log(thumbnail);
    if (thumbnail) {
        const uploadImage = await uploadOnCloudinary(thumbnail, process.env.CLOUDINARY_FOLDER_NAME);
        if (!uploadImage) {
            throw new ApiError(401, "error in uploading image to cloudinary");
        }

        coursetoUpdate.thumbnail = uploadImage.secure_url || "";
    }

    await coursetoUpdate.save();

    const categoryDetails = await Category.findById(category);

    // if (!categoryDetails) {
    //     throw new ApiError(401, "categoryDetails are not found");
    // }

    // for (const key in updates) {
    //     if (updates.hasOwnProperty(key)) {
    //         course[key] = updates[key]
    //         // if (key === "tag" || key === "instructions") {
    //         //   course[key] = JSON.parse(updates[key])
    //         // } else {
    //         //   course[key] = updates[key]
    //         // }
    //     }
    // }

    const updatedCourseDetails = await Course.findByIdAndUpdate({ _id: courseId },
        {
            courseName: courseName,
            courseDescription: courseDescription,
            whatYouWillLearn: whatYouWillLearn,
            price: price,
            category: categoryDetails._id,
            tag: tag,
            status,
        }, {
        new: true
    })
        .populate({
            path: "instructor",
            populate: {
                path: "additionalDetails",
            },
        })
        .populate("category")
        // .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate: {
                path: "subsection",
            },
        }).exec()



    if (!updatedCourseDetails) {
        throw new ApiError(404, "Problem in updating course detalis in db");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedCourseDetails, "Course details updated Successfully")
    )
})

const getInstructorCourses = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    const getallInstructorCourses = await Course.find({
        instructor: userId
    }).sort({ createdAt: -1 }).populate({
        path: "courseContent",
        populate: {
            path: "subsection"
        }
    });

    return res.status(200).json(
        new ApiResponse(200, getallInstructorCourses, "All courses fetched successfully")
    )
})

const deleteCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.body;

    if (!courseId) {
        throw new ApiError(404, "course id required");
    }

    const CourseToBeDeleted = await Course.findById(courseId);

    if (!CourseToBeDeleted) {
        throw new ApiError(404, "Error in finding courses from db");
    }

    const categoryId = CourseToBeDeleted.category.toString();
    // console.log(categoryId)
    await Category.findByIdAndUpdate(categoryId,
        {
            $pull: {
                courses: courseId
            }
        }, {
        new: true
    })

    const userafterdeletecouser = await User.findByIdAndUpdate(req.user._id,
        {
            $pull: {
                courses: courseId
            }
        },
        { new: true }
    )

    if (!userafterdeletecouser) {
        throw new ApiError(404, "Error in deleting course from user");
    }

    const studentsEnrolledInCourse = CourseToBeDeleted.studentsEnrolled;
    // console.log("Student enrolled -> ",studentsEnrolledInCourse);
    for (const stdId of studentsEnrolledInCourse) {
        await User.findByIdAndUpdate({ _id: stdId }, {
            $pull: {
                courses: courseId,
            }
        }, {
            new: true
        })
    }

    // Deletion of Section and subsection
    const courseContentData = CourseToBeDeleted.courseContent;
    // console.log("Course Content data -> ",courseContentData);
    for (const sectionId of courseContentData) {
        // console.log(sectionId);
        const section = await Section.findById(sectionId);
        if (section) {
            const Subsections = section.subsection;
            for (const subsectionId of Subsections) {
                await Subsection.findByIdAndDelete(subsectionId);
            }
        }
        await Section.findByIdAndDelete(sectionId);
    }

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
        throw new ApiError(404, "Error in deleting courses from db");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedCourse, "Course Deleted Successfully")
    )
})

export {
    createCourse,
    getAllCourses,
    getCourseDetails,
    updateCourseDetails,
    getInstructorCourses,
    deleteCourse,
}