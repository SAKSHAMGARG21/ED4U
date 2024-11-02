import {Router} from "express";
import { clearComment, getComments, newComment } from "../controllers/comments.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router=Router();
router.use(verifyJWT);

router.route("/getcomments").get(getComments);
router.route("/newcomment").post(newComment);
router.route("/clearcomment").delete(clearComment);


export default router