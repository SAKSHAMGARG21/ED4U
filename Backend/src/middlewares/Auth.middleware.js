// import { asyncHandler } from "../utils/asyncHandler.js";
// import { User } from "../modules/user.models.js";
// import { ApiError } from "../utils/apiErrors.js";
// import jwt from "jsonwebtoken";

// export const verifyJWT = asyncHandler(async (req, res, next) => {
//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

//         if (!token) {
//             throw new ApiError(401, "Unauthorized request");
//         }

//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

//         if (!user) {
//             throw new ApiError(401, "Invalid Access Token");
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         throw new ApiError(401,error?.message || "Invalid Tokens")
//     }
// })

import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../modules/user.models.js";
import { ApiError } from "../utils/ApiErrors.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        let token;
        if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // console.log("Token:", token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log("DecodedToken :",decodedToken);

        if (!decodedToken || !decodedToken._id) {
            throw new ApiError(401, "Invalid Access Token");
        }

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "User associated with the token not found");
        }

        // console.log(user);

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid Tokens");
    }
});

export const isStudent = asyncHandler(async (req, res, next) => {
    if (req.user.accountType !== "Student") {
        throw new ApiError(401, "this is protected route for student only");
    }
    next();
})

export const isInstructor = asyncHandler(async (req, res, next) => {
    if (req.user.accountType !== "Instructor") {
        throw new ApiError(401, "this is protected route for Instructor only");
    }
    next();
})

export const isAdmin = asyncHandler(async (req, res, next) => {
    if (req.user.accountType !== "Admin") {
        throw new ApiError(401, "this is protected route for Admin only");
    }
    next();
})

export const isAdminOrInstructor = (req, res, next) => {
    if (req.user.accountType !== 'Admin' || req.user.accountType !== 'Instructor') {
        throw new ApiError(401, "this is protected route for Admin or Instructor only");
    }
    next();
};