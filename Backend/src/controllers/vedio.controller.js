import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary, deleteImagefromCloudinary, deleteVideofromCloudinary } from "../utils/cloudinary.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../modules/vedio.models.js"
import { User } from "../modules/user.models.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination

    const videos = await Video.find({}).populate("owner")
        .sort({ [sortBy]: sortType })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec()
    const totalVideos = await Video.countDocuments()
    const totalPages = Math.ceil(totalVideos / limit)
    const response = new ApiResponse(200, { uservideos: videos, totalVideos, totalPages }, "All videos Fetched  Successfully")

    return res.json(response);
})

const getVideosByUserId = asyncHandler(async (req, res) => {
    const currUserid = req.user?._id;
    const userid = currUserid.toString();

    if (!userid) {
        throw new ApiError(401, "User not found login first");
    }

    const userVideos = await Video.find({ owner: userid });
    if (!userVideos) {
        throw new ApiError(401, "Videos of the user not found");
    }

    const response = new ApiResponse(200, userVideos, "Videos of the user fetched successfully");
    return res.json(response);
})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    const { title, description, duration, views, isPublished } = req.body

    const videoLocalPath = req.files?.videoFile[0].path;

    const thumbnailLocalPath = req.files?.thumbnail[0].path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required");
    }

    const videofile = await uploadOnCloudinary(videoLocalPath, process.env.CLOUDINARY_FOLDER_NAME);
    if (!videofile) {
        throw new ApiError(400, "Failed to upload video to cloudinary");
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, process.env.CLOUDINARY_FOLDER_NAME);
    if (!thumbnail) {
        throw new ApiError(400, "Failed to upload video to cloudinary");
    }

    const videofileDetails = {
        id: videofile.public_id,
        url: videofile.secure_url
    }
    const thumbnailfileDetails = {
        id: thumbnail.public_id,
        url: thumbnail.secure_url
    }

    const createdVideo = await Video.create({
        videoFile: videofileDetails,
        thumbnail: thumbnailfileDetails,
        title: title,
        owner: req.user._id,
        description: description,
        duration: duration,
        views: views,
        isPublished: isPublished,
    })

    if (!createdVideo) {
        throw new ApiError(400, "Failed to create video");
    }

    return res.status(201).json(
        new ApiResponse(200, createdVideo, "Video uploaded on  Clodinary Succssfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    //TODO: get video by id

    const { videoId } = req.params;

    const video = await Video.findById(videoId).populate("owner");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const userWatched = await User.findById(req.user?._id);
    if (!userWatched) {
        throw new ApiError(401, "You are not logged in");
    }

    if (!userWatched.watchHistory.includes(videoId)) {
        userWatched.watchHistory.push(videoId);
        video.views = video.views + 1;
    }
    
    await userWatched.save({ validateBeforeSave: true });
    await video.save({ validateBeforeSave: true });

    const response = new ApiResponse(200, video, "Single  Video fetched successfully");
    return res.status(201).json(response);
})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail

    const { videoId } = req.params;
    const { title, description } = req.body;
    const thumbnailLocalPath = req.file?.path;

    if (!thumbnailLocalPath) {
        throw new ApiError(404, "Thumbnail file is missing");
    }

    const uploadthumbnail = await uploadOnCloudinary(thumbnailLocalPath, process.env.CLOUDINARY_FOLDER_NAME);

    if (!uploadthumbnail) {
        throw new ApiError(404, "Error in uploading  thumbnail file");
    }

    const thumbnailDetails = {
        id: uploadthumbnail.public_id,
        url: uploadthumbnail.secure_url,
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId,
        {
            $set: {
                title: title,
                description: description,
                thumbnail: thumbnailDetails
            }
        },
        {
            new: true
        }
    );

    if (!updatedVideo) {
        throw new ApiError(404, "Error in updating Video");
    }

    const response = new ApiResponse(200, updatedVideo, "Video updated Successfully");

    return res.status(201).json(response);
})

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video
    const { videoId } = req.params;

    const deletedVideo = await Video.findByIdAndDelete(videoId);
    if (!deletedVideo) {
        throw new ApiError(404, "Video not found");
    }

    const deletedvideofile = await deleteVideofromCloudinary(deletedVideo.videoFile.id);
    if (!deletedvideofile) {
        throw new ApiError(404, "Error in deleting video file");
    }
    const deletedthumbnailfile = await deleteImagefromCloudinary(deletedVideo.thumbnail.id);
    if (!deletedthumbnailfile) {
        throw new ApiError(404, "Error in deleting thumbnail file");
    }

    const response = new ApiResponse(200, deletedVideo, "Video deleted Successfully");
    return res.status(201).json(response);
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const publishStatus = req.body.isPublished;
    // console.log(publishStatus, videoId);

    const toggledpublishe = await Video.findByIdAndUpdate(videoId,
        {
            $set: {
                isPublished: publishStatus
            }
        },
        {
            new: true
        }
    );

    if (!toggledpublishe) {
        throw new ApiError(404, "Video not found");
    }

    const response = new ApiResponse(200, toggledpublishe, " Published changed successfully");
    return res.status(201).json(response);
})


const clearWatchHistory = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.watchHistory = [];
    await user.save({ validateBeforeSave: true });

    const response = new ApiResponse(200, user, "Watch History cleared successfully");
    return res.send(response);
})

export {
    getAllVideos,
    getVideosByUserId,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    clearWatchHistory
}