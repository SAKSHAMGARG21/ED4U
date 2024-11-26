import { Router } from "express";
import { categoryPageDetails, createCategory, getAllCategory } from "../../controllers/category.controller.js";
import { isAdmin, verifyJWT } from "../../middlewares/Auth.middleware.js";

const router=Router();

router.route("/createcategory").post(verifyJWT,isAdmin,createCategory);
router.route("/getallcategory").get(getAllCategory);
router.route("/categorypagedetails").post(categoryPageDetails);

export default router;