// Importing necessary modules and functions
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../modules/user.models.js"
import { ApiError } from "../utils/ApiErrors.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import jwt from "jsonwebtoken";
import OtpValidation from "../modules/Otp.model.js"
import mailSender from "../utils/MainSender.js"
import { Profile } from "../modules/profile.model.js"
import { passwordUpdated } from "../mail/templates/passwordUpdateTemplate.js"

// Function is to fetch all the users form db 
const getallUsers = asyncHandler(async (req, res) => {

    const users = await User.find({});

    return res.status(200).json(
        new ApiResponse(200, users, "All users fetched successfully")
    )
})

const deleteallUsers = asyncHandler(async (req, res) => {
    const users = await User.deleteMany({});

    return res.status(200).json(
        new ApiResponse(200, users, "All users deleted  successfully")
    )
})

const deleteUserById = async (userId) => {

    try {

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            throw new ApiError("User not found for deleting user by id");
        }

        return deletedUser;

    } catch (error) {
        throw new ApiError(500, "Error in delete User by Id ");
    }
}

// Function to generate access and refresh tokens for a given user ID
const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

// Function to handle user registration
const regesterUser = asyncHandler(async (req, res) => {
    // Validation, checking for existing users, and uploading avatars and cover images
    // Creating a new user document and returning a success response with the created user details

    // get user details from frontend
    // validation - not empty
    // check user if already exist , user and email
    // check for images,avtar ,
    // upload on cloudinary ,avtart
    // create user object , user entry in db
    // refresh password and refresh token field from response
    // check for  user creation
    // return res


    // const user = req.body;
    // console.log("FullName :", user.fullName);
    // console.log("Email :", user.email);
    // console.log("UserName :", user.userName);
    // console.log("Password:", user.password);
    // res.send(user);


    // console.log(req.body);
    const { fullName, email, userName, password, accountType, otp } = req.body;

    if (
        [fullName, email, userName, password, accountType, otp].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with username or email already exists");
    }

    // const avatarLocalPath = req.files?.avtar[0].path;
    // // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path;
    // }

    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar file is required");
    // }

    // const avtar = await uploadOnCloudinary(avatarLocalPath, process.env.CLOUDINARY_FOLDER_NAME);

    // const coverImage = await uploadOnCloudinary(coverImageLocalPath, process.env.CLOUDINARY_FOLDER_NAME);
    // if (!avtar) {
    //     throw new ApiError(400, "Cloudinary Avatar file is required")
    // }

    const verifiedOtp = await verifyEmailOtp(email, otp);

    if (!verifiedOtp) {
        throw new ApiError(401, "Error User not verified");
    }

    const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: null
    })

    let names = fullName.split(" ");
    let firstName = names[0];
    let lastname = names[1];

    const user = await User.create({
        userName: userName.toLowerCase(),
        fullName,
        avtar: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastname}`,
        coverImage: "",
        email,
        password,
        accountType,
        additionalDetails: profileDetails._id
    })

    const createdUser = await User.findOne(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while regestring the user");
    }

    return res.status(200).json(
        new ApiResponse(200, { user: createdUser }, "User registered successfully Verify Your OTP from your email")
    )
})

// Function to handle OTP Verification 
const sendOtpVerificationEmail = asyncHandler(async (req, res) => {

    const { email } = req.body;

    const otp = Math.floor(1000 + Math.random() * 9000);

    // const saltRounds = 10;

    // const hashedOtp = await bcrypt.hash(otp.toString(), saltRounds);
    console.log(otp);

    const newOtpValidation = await OtpValidation.create({
        email: email,
        otp: otp,
    });

    if (!newOtpValidation) {
        throw new ApiError(404, "Error in saving otp details in db");
    }

    return res.status(200).json(
        new ApiResponse(200, newOtpValidation, "OTP send Successfully")
    )
})

const verifyEmailOtp = async (email, otp) => {
    // console.log(email, otp);
    if (!(email && otp)) {
        throw new ApiError(400, "Please provide both userId and otp");
    }

    const UserOtp = await OtpValidation.find({ email });

    if (!UserOtp) {
        throw new ApiError(400, "Account dose not exist or has been verified already.Please sign up or login first");
    }

    const { expiresAt } = UserOtp[0];
    const dbOtp = UserOtp[0].otp;

    if (expiresAt < Date.now()) {
        await OtpValidation.deleteMany({ email });
        throw new ApiError(400, "Code has expired. Please request agaain");
    }

    const validOtp = (otp.toString() === dbOtp) ? true : false;

    if (!validOtp) {
        throw new ApiError(400, "Invalid code. Please check your Mail inbox");
    }

    await OtpValidation.deleteMany({ email });

    return validOtp;
    // return res.status(200).json(
    //     new ApiResponse(200, validOtp, "User Verified Successfully")
    // )
}

// resend OTP Verification
const resendOtpVerificationEmail = asyncHandler(async (req, res) => {

    const { email } = req.body;

    if (!email) {
        throw new ApiError(404, "userId and email required");
    }

    await OtpValidation.deleteMany({ email });

    const resendotp = sendOtpVerificationEmail(email);

    const response = new ApiResponse(200, resendotp, "OTP sent to your email");
    return res.status(200).json(response);
})

// Function to handle user login
const loginUser = asyncHandler(async (req, res) => {
    // Validating user input, finding the user in the database, checking the password,
    // generating access and refresh tokens, and returning a success response with the logged-in user details and tokens

    // req -> data form body
    // username or email
    // find the user
    // check password
    // access or refresh token
    // send cookies

    const { userName, email, password } = req.body;

    if (!(userName || email)) {
        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({ $or: [{ userName }, { email }] });
    // console.log(user);
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggenInUser = await User.findById(user._id).select("-password -refreshToken").populate("additionalDetails");

    const option = {
        httpOnly: true,
        secure: true,
        // maxAge: 60000
    }
    const option2 = {
        httpOnly: true,
        secure: true,
        maxAge: 300000
    }

    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggenInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        );
})

// Function to handle user logout
const logoutUser = asyncHandler(async (req, res) => {
    // Clearing the refresh token from the user document and returning a success response with a message

    // console.log("user :",req.user);
    // console.log("user :",req.user._id.refreshToken);
    const logoutUser = await User.findOneAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        { new: true }
    )

    // console.log("user:",req.user.refreshToken);

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, logoutUser, "User logout successfully"));
})

// Function to handle refreshing access tokens
const refreshAccessToken = asyncHandler(async (req, res) => {
    // Verifying the incoming refresh token, retrieving the user from the database,
    // generating new access and refresh tokens, and returning a success response with the refreshed tokens

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    // console.log(incomingRefreshToken);
    // console.log("in refresh token");

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request. No refresh token provided");
    }

    try {
        const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        // console.log(decodedRefreshToken);

        const user = await User.findById(decodedRefreshToken?._id);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        if (!user.refreshToken || user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized request. Invalid refresh token");
        }

        const option = {
            httpOnly: true,
            secure: true,
            // maxAge: 60000
        }
        const option2 = {
            httpOnly: true,
            secure: true,
            // maxAge: 300000
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
        // console.log(refreshToken);
        return res.status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option2)
            .json(new ApiResponse(
                200,
                { user: user, accessToken: accessToken, newrefreshToken: refreshToken },
                "User refreshed successfully"
            ));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }

})

// Function to change the password
const changePassword = asyncHandler(async (req, res) => {
    // Validating user input, finding the user in the database, checking the current password,
    // updating the password, and returning a success response with a message

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    // console.log(user);
    const isPassCort = await user.isPasswordCorrect(currentPassword);

    if (!isPassCort) {
        throw new ApiError(400, "Old Password is not Correct Please Enter the Correct Password");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res.status(200)
        .json(new ApiResponse(200, { user }, "Password Changed Successfully"));
})

// Function to Forgot Password
// reset password Token
const resetPasswordSendMail = asyncHandler(async (req, res) => {

    const email = req.body.email;

    const user = await User.findOne({ email: email });

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    const token = crypto.randomUUID();

    const updatedUser = await User.findOneAndUpdate(
        { email: email },
        {
            refreshToken: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000
        },
        {
            new: true
        }
    )

    if (!updatedUser) {
        throw ApiError(401, "User not update in reset Password send Mail");
    }

    const url = `http://localhost:5173/update-password/${token}`;

    const mainbody = passwordUpdated(url,email,user.fullName);

    // const resetPasslink = await mailSender(email, "Change Your Password keep remmember next time", `Password Reset Link: ${url}`);
    const resetPasslink = await mailSender(email, "Change Your Password keep remmember next time", mainbody);

    return res.status(200).json(
        new ApiResponse(200, resetPasslink, "Email send successfully")
    )

})

const resetPassword = asyncHandler(async (req, res) => {

    const { password,token } = req.body;

    if (!(password || token)) {
        throw new ApiError(401, "Password required to change");
    }

    const userDetails = await User.findOne({ refreshToken: token });

    if (!userDetails) {
        throw new ApiError(401, "Tokon inValid");
    }

    if (userDetails.resetPasswordExpires < Date.now()) {
        throw new ApiError(401, "Token is Expired, please retry again");
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const updatedDetails = await User.findOneAndUpdate({
        refreshToken: token
    }, {
        password: hashedpassword
    }, { new: true })

    return res.status(200).json(
        new ApiResponse(200, updatedDetails, "Password updated successfully")
    )
})

// Function to get the current user logged In
const getCurrUser = asyncHandler(async (req, res) => {
    // const user=await User.findById(req.user?._id);
    return res.status(200)
        .json(new ApiResponse(200, req.user, "User Fetched Successfully"));
})

// Function to update the user Details
const updateUser = asyncHandler(async (req, res) => {

    const { fullName, email } = req.body;
    if (!fullName || !email) {
        throw new ApiError(200, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {
            new: true
        }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, user, "Account Details updated Successfully"));
})

// Functon to update the avtar image
const updateAvtarImg = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const uploadAvatar = await uploadOnCloudinary(avatarLocalPath, process.env.CLOUDINARY_FOLDER_NAME);

    if (!uploadAvatar) {
        throw new ApiError(401, "Error in uploading avatar file on Cloudinary");
    }

    const oldAvtar = await User.findById(req.user?._id).select("-_id avatar");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avtar: uploadAvatar.url
            }
        },
        {
            new: true
        }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, { user: user, oldAvtar: oldAvtar }, "Avatar Image updated Successfully"));
})

// Function to update the cover image
const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImgLocPath = req.file?.path;

    if (!coverImgLocPath) {
        throw new ApiError(401, "Cover Image is missing");
    }

    const uploadCoverImg = await uploadOnCloudinary(coverImgLocPath, process.env.CLOUDINARY_FOLDER_NAME);

    if (!uploadCoverImg) {
        throw new ApiError(401, "Error in uploading Cover Image on Cloudinary");
    }

    const oldColverImg = await User.findById(req.user?._id).select("-_id coverImage");

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: uploadCoverImg.url
            }
        }, {
        new: true
    }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, { user: user, oldColverImg: oldColverImg }, "Cover Image is Updated Successfullu"));
})

/*
// mongodb atlas
aggregaiton piplines
[
    {
      $lookup: {
        from: "Authers",
        localField: "author_id",
        foreignField: "_id",
        as: "author_details"
      }
    },
    {
      $addFields: {
        author_details:{
            // $first: "$author_details"
          $arrayElemAt:["$author_details",0]
        }
      }
    }
] 
*/

// Fuction to get the user channel profile
const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { userName } = req.params;

    if (!userName?.trim()) {
        throw new ApiError(404, "Username is missing");
    }

    // console.log(userName);

    const channel = await User.aggregate([
        {
            $match: {
                userName: userName?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscibed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscibed: 1,
                avtar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "Channel not exists");
    }

    return res.status(200).json(
        new ApiResponse(200, channel[0], "Users channel fetched successfully")
    )
})

// Function to get the user watch History
// const getUserWatchHistory = asyncHandler(async (req, res) => {
//     const user = await User.aggregate([
//         {
//             $match: {
//                 _id: new mongoose.Types.ObjectId(req.user._id)
//             }
//         },
//         {
//             $lookup: {
//                 form: "videos",
//                 localField: "watchHistory",
//                 foreignField: "_id",
//                 as: "watchHistory",
//                 pipeline: [
//                     {
//                         $lookup: {
//                             from: "users",
//                             localField: "owner",
//                             foreignField: "_id",
//                             as: "owner",
//                             pipeline: [
//                                 {
//                                     $project: {
//                                         fullName: 1,
//                                         userName: 1,
//                                         avtar: 1
//                                     }
//                                 }
//                             ]
//                         }
//                     },
//                     {
//                         $addFields: {
//                             owner: {
//                                 $first: "$owner"
//                             }
//                         }
//                     }
//                 ]
//             }
//         }
//     ])
//     return res.status(200).json(
//         new ApiResponse(200, user[0].watchHistory, "Watch History fetched Successfully")
//     )
// })

const getUserWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory"
            }
        },
        {
            $project: {
                watchHistory: {
                    _id: 1,
                    title: 1,
                    thumbnail: 1,
                    videoFile: 1,
                    owner: 1
                },
            }
        },
        // {
        //     $lookup: {
        //         from: "users",
        //         localField: "watchHistory.owner",
        //         foreignField: "_id",
        //         as: "watchHistory.owner"
        //     }
        // },
        // {
        //     $unwind: "$watchHistory"
        // },
        // {
        //     $project: {
        //         watchHistory: {
        //             owner: {
        //                 _id: 1,
        //                 fullName: 1,
        //                 userName: 1,
        //             }
        //         }
        //     },
        // }
    ]);

    const onwerdetails = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "watchHistory.owner",
                foreignField: "_id",
                as: "watchHistory.owner"
            }
        },
        {
            $unwind: "$watchHistory"
        },
        {
            $project: {
                watchHistory: {
                    owner: {
                        _id: 1,
                        fullName: 1,
                        userName: 1,
                    }
                }
            }
        }
    ])
    const resuser = user[0];
    const resuserdetails = onwerdetails[0];
    return res.status(200).json(
        new ApiResponse(200, { resuser, resuserdetails }, "Watch History fetched Successfully")
    );
});


// Exporting the functions for use in the server routes
export {
    regesterUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getCurrUser,
    updateUser,
    updateAvtarImg,
    updateCoverImage,
    getUserChannelProfile,
    getUserWatchHistory,
    getallUsers,
    verifyEmailOtp,
    resendOtpVerificationEmail,
    resetPasswordSendMail,
    resetPassword,
    sendOtpVerificationEmail
}


