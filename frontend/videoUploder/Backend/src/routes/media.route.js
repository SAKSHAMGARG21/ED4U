import express from "express";
import { deleteVideo, getmedia, postmedia, updateVideo } from "../controllers/media.controller.js";
import bodyParser from "body-parser"
import { upload } from "../middleware/media.middleware.js";

const router = express.Router();

router.route("/")
    .get(getmedia)
    .post(
        upload.fields([
            { name: 'image', maxCount: 1 },
            { name: 'videos', maxCount: 5 }
        ]),
        postmedia
    );

router.route("/:id")
    .delete(deleteVideo)
    .patch((bodyParser.json()),updateVideo);

export default router;
