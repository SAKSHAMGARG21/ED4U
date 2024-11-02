import { Like } from "../modules/likes.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const countlikes = asyncHandler(async (req, res) => {
    const video = req.params;
    const likescount = await Like.find({ video: video.id });

    if (!likescount) {
        throw new ApiError(401, "Error in counting likes");
    }

    return res.status(200).json(new ApiResponse(200, likescount, "This is total likes on this video"));
})

const likeVideo = asyncHandler(async (req, res) => {
    const { videoid } = req.body;

    const existedlike = await Like.findOne({
        $and: [{ video: videoid }, { likedBy: req.user?._id }]
    })

    if (!existedlike) {
        throw new ApiError(401, "Don't like again");
    }

    const likedVideo = await Like.create({ video: videoid, likedBy: req.user?._id });

    if (!likedVideo) {
        throw new ApiError(401, "Error in creating like");
    }

    return res.status(200).json(new ApiResponse(200, likedVideo, "Video liked  successfully"));
});

const dislikeVideo = asyncHandler(async (req, res) => {
    const { video } = req.body;

    const dislikedVideo = await Like.findOneAndDelete({
        $and: [{ video: video }, { likedBy: req.user?._id }]
    });

    if (!dislikedVideo) {
        throw new ApiError(401, "Error in dislike video");
    }

    return res.status(200).json(new ApiResponse(200, dislikedVideo, "Video disliked successfully"));
})

export {
    likeVideo,
    dislikeVideo,
    countlikes
}