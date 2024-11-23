import { Profile } from "../modules/profile.model.js";
import { User } from "../modules/user.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

const getallUsersDetails= asyncHandler(async(req,res)=>{
    const id = req.user._id;

    const userDetails= await User.findById(id).populate("additionalDetails").exec();

    return res.status(200).json(
        new ApiResponse(200,
            userDetails,
            "User details fetched successfully"
        )
    )
})

const getenrolledUserCourses= asyncHandler(async(req,res)=>{

    const userId= req.user._id;

    if (!userId){
        throw new ApiError(404,"User not found");
    }

    const userDetails= await User.findById(userId)
    .populate({
        path: "courses",
        populate:{
            path: "courseContent",
            populate:{
                path: "subsection",
            }
        }
    }).exec();

    

    if (!userDetails){
        throw new ApiError(404,"User Details not found");
    }

    return res.status(200).json(
        new ApiResponse(200,userDetails,"Successfully fetched User Enrolled Courses")
    )

})
const updateDisplayPicture= asyncHandler(async(req,res)=>{

})
const instructorDashboard= asyncHandler(async(req,res)=>{

})



export {
    updateProfile,
    deleteAccount,
    getallUsersDetails,
    getenrolledUserCourses,
    updateDisplayPicture,
    instructorDashboard
}
