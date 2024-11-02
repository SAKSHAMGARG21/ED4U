import { Router } from "express";
import { createRatingAndReviews, getAllRating, getAverageRating } from "../controllers/ratingAndReviews.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
const router = Router();
router.use(verifyJWT);
router.route("/createratingandreview").post(createRatingAndReviews);
router.route("/getavgeragerating").get(getAverageRating);
router.route("/getallrating").get(getAllRating);

export default router;