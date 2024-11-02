import { Playlist } from "../modules/playlists.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getuserAllplaylist = asyncHandler(async (req, res) => {
    const  user = req.user;
    const id=user._id.toString();
    const playlists = await Playlist.find({ owner: id});
    return res.json(new ApiResponse(200, playlists, "User Playlists fetched successfully"));
})

const createplaylist = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const createPlaylist = await Playlist.create({
        name: name,
        owner: req.user?._id,
        vidoes: []
    })

    if (!createPlaylist) {
        throw new ApiError(401, "Error in creating new Playlist");
    }

    const response = new ApiResponse(200, "Playlist created successfully");
    return res.status(200).json(response);
})

const deleteplaylist = asyncHandler(async (req, res) => {

    const playlistId = req.params.id;
    console.log(playlistId);
    const playlist = await Playlist.findOneAndDelete({
        $and: [{ _id: playlistId }, { owner: req.user?._id }]
    });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    const response = new ApiResponse(200, "Playlist deleted successfully");
    return res.status(200).json(response);
})

const addvideoinplaylist = asyncHandler(async (req, res) => {
    const playlistId = req.params.id;
    const videoId = req.body.videoId;
    const playlist = await Playlist.findOne({
        $and: [{ _id: playlistId }, { owner: req.user?._id }]
    });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (!playlist.videos.includes(videoId)) {
        playlist.videos.push(videoId);
    }
    await playlist.save();

    const response = new ApiResponse(200, playlist, "Video added to  playlist successfully");
    return res.status(200).json(response);

})

const deletevideofromplaylist = asyncHandler(async (req, res) => {

    const playlistId = req.params.id;
    const videoId = req.body.videoId;
    const playlist = await Playlist.findOne({
        $and: [{ _id: playlistId }, { owner: req.user?._id }]
    });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(404, "Video not found in playlist");
    }

    if (playlist.videos.includes(videoId)) {
        playlist.videos.pull(videoId);
    }

    await playlist.save();

    const response = new ApiResponse(200, playlist, "Video removed from playlist successfully");
    return res.status(200).json(response);

})

const updateplaylist = asyncHandler(async (req, res) => {
    const playlistId = req.params.id;
    const { name } = req.body;
    const playlist = await Playlist.findOne({
        $and: [{ _id: playlistId }, { owner: req.user?._id }]
    });

    playlist.name = name;
    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist updated successfully")
    )
})

export {
    createplaylist,
    deleteplaylist,
    getuserAllplaylist,
    deletevideofromplaylist,
    addvideoinplaylist,
    updateplaylist
}