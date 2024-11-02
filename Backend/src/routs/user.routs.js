// Import necessary modules from express and custom controllers and middlewares
import { Router } from "express"
import {
    changePassword,
    getallUsers,
    getCurrUser,
    getUserChannelProfile,
    getUserWatchHistory,
    loginUser,
    logoutUser,
    refreshAccessToken,
    regesterUser,
    resendOtpVerificationEmail,
    resetPassword,
    resetPasswordSendMail,
    updateAvtarImg,
    updateCoverImage,
    updateUser,
    verifyEmailOtp
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/Auth.middleware.js"

// Initialize a new router instance
const router = Router()

// Define a POST route for user registration
// The route uses multer middleware to handle file uploads for 'avtar' and 'coverImage' fields
router.route("/regester").post(
    upload.fields([
        {
            name: "avtar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    regesterUser
)

// To Verify email address 
router.route("/verifyemail")
    .post(verifyEmailOtp);

// Resend email for otp
router.route("/resendmail")
    .post(resendOtpVerificationEmail);

// To get all the users from db
router.route("/allUsers")
    .get(verifyJWT, getallUsers);

// Define a POST route for user login
router.route("/login")
    .post(loginUser);

// Define a POST route for user logout
// The route is secured using the verifyJWT middleware to ensure only authenticated users can access it
router.route("/logout")
    .post(verifyJWT, logoutUser);

// Verifying the incoming refresh token, retrieving the user from the database,
// generating new access and refresh tokens, and returning a success response with the refreshed tokens
router.route("/refreshToken")
    .post(refreshAccessToken);

// change password
router.route("/change-password")
    .post(verifyJWT, changePassword);

router.route("/resetPassword")
    .post(resetPasswordSendMail);

router.route("/forgot-password")
    .post(resetPassword);

// Get the current user
router.route("/current-user")
    .get(verifyJWT, getCurrUser);

// Update the user
router.route("/update-user")
    .patch(verifyJWT, updateUser);

// Update the Avtar
router.route("/update-avtar")
    .patch(verifyJWT, upload.single("avtar"), updateAvtarImg);

// Update the Cover Image
router.route("/update-cover-img")
    .patch(verifyJWT, upload.single("coverImage"), updateCoverImage);

// Get the user Profile 
router.route("/c/:userName")
    .get(verifyJWT, getUserChannelProfile);

// get the user Watch History
router.route("/watch-history")
    .get(verifyJWT, getUserWatchHistory);

// Export the router instance to be used in the main application
export default router