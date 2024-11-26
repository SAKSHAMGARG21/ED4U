import { CourseProgress } from "../modules/coursesProgress.model.js";
import { Profile } from "../modules/profile.model.js";
import { User } from "../modules/user.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { convertSecondsToDuration } from "../utils/secToDuration.js";

const updateProfile = asyncHandler(async (req, res) => {
    const { gender, dateOfBirth = "", about = "", contactNumber } = req.body;

    const id = req.user._id;

    const userDetails = await User.findById(id);

    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findByIdAndUpdate(
        {
            _id: profileId,
        },
        {
            gender,
            dateOfBirth,
            about,
            contactNumber,
        },
        {
            new: true
        }
    )

    if (!profileDetails) {
        throw new ApiError(401, "Error in updating profile in db");
    }

    return res.status(200).json(
        new ApiResponse(200,
            profileDetails,
            "User profile updated Successfully"
        )
    )
})


// what is crone job how to schedule job for opration
const deleteAccount = asyncHandler(async (req, res) => {

    const id = req.user._id;

    const curruser = await User.findById(id);

    if (!curruser) {
        throw new ApiError(401, "User not found");
    }

    await Profile.findByIdAndDelete({ _id: curruser.additionalDetails });

    await User.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200,
            "user Deleted Successfully"
        )
    )
})

const getallUsersDetails = asyncHandler(async (req, res) => {
    const id = req.user._id;

    const userDetails = await User.findById(id).populate("additionalDetails").exec();

    return res.status(200).json(
        new ApiResponse(200,
            userDetails,
            "User details fetched successfully"
        )
    )
})

const getenrolledUserCourses = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(404, "User not found");
    }

    const userDetails = await User.findById(userId)
        .populate({
            path: "courses",
            populate: {
                path: "courseContent",
                populate: {
                    path: "subsection",
                }
            }
        }).exec();

    if (!userDetails) {
        throw new ApiError(404, "User Details not found");
    }

    const user = userDetails.toObject();
    var SubSectionlength = 0;
    for (let i = 0; i < user.courses.length; i++) {
        let totalCourseDurationInSeconds = 0;
        SubSectionlength = 0;
        for (let j = 0; j < user.courses[i].courseContent.length; j++) {
            totalCourseDurationInSeconds += user.courses[i].courseContent[j].subsection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0);
            user.courses[i].timeDuration = convertSecondsToDuration(totalCourseDurationInSeconds);

            SubSectionlength += user.courses[i].courseContent[j].subsection.length;
        }

        let courseProgressCount = await CourseProgress.findOne({ userId: userId, courseId: user.courses[i]._id })

        courseProgressCount = courseProgressCount?.completedVideos.length;

        if (SubSectionlength === 0) {
            user.courses[i].courseProgressPrecentage = 100;
        } else {
            const mult = Math.pow(10, 2)
            user.courses[i].courseProgressPrecentage = Math.round((courseProgressCount / SubSectionlength) * 100 * mult) / mult;
        }
    }


    return res.status(200).json(
        new ApiResponse(200,  user.courses, "Successfully fetched User Enrolled Courses")
    )

})
const updateDisplayPicture = asyncHandler(async (req, res) => {

})
const instructorDashboard = asyncHandler(async (req, res) => {

})



export {
    updateProfile,
    deleteAccount,
    getallUsersDetails,
    getenrolledUserCourses,
    updateDisplayPicture,
    instructorDashboard
}
