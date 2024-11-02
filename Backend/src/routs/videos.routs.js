import { Router } from 'express';
import { upload } from "../middlewares/multer.middleware.js"
import {
    clearWatchHistory,
    deleteVideo,
    getAllVideos,
    getVideoById,
    getVideosByUserId,
    publishAVideo,
    togglePublishStatus,
    updateVideo
} from '../controllers/vedio.controller.js';
import { verifyJWT } from '../middlewares/Auth.middleware.js';

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
        ]),
        publishAVideo
    );

router.route("/userVideos").get(getVideosByUserId);

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
router.route("/cwh").post(clearWatchHistory);

export default router