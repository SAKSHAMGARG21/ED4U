import { Router } from "express";
import { countlikes, dislikeVideo, likeVideo } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router=Router();
router.use(verifyJWT);

router.route("/countlikes/:id").get(countlikes);
router.route("/likevideo").post(likeVideo);
router.route("/dislikevideo").delete(dislikeVideo);

export default router;