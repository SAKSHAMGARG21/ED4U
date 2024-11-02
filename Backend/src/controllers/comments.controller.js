import { Comment } from "../modules/comments.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getComments = asyncHandler(async (req, res) => {
    const { video } = req.body;

    // const allVideoComments = await Comment.find({ video }).populate('user').populate('video');
    const allVideoComments = await Comment.find({ video });

    if (!allVideoComments) {
        throw new ApiError(401, "Error in fetching all comments");
    }

    return res.status(200).json(new ApiResponse(200, allVideoComments, "Getting all comments for video"));
})

const newComment = asyncHandler(async (req, res) => {
    const { content, videoid } = req.body;
    const createdComment = await Comment.create(
        {
            content,
            video: videoid,
            owner: req.user?._id
        }
    );

    if (!createdComment) {
        throw new ApiError(401, "Error in creating comment");
    }

    return res.status(200).json(new ApiResponse(200, createdComment, "Comment created successfully"));
})

const clearComment = asyncHandler(async (req, res) => {
    const { commentid,video } = req.body;

    const deletedComment = await Comment.findOneAndDelete({ 
        $and :[{_id:commentid},{video:video}]
     });

    if (!deletedComment) {
        throw new ApiError(401, "Error in deleting comment");
    }

    return res.status(200).json(new ApiResponse(200, deletedComment, "Comment deleted successfully"));
})

export {
    newComment,
    clearComment,
    getComments
}