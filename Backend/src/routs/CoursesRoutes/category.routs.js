import { Router } from "express";
import { categoryPageDetails, createCategory, getAllCategory } from "../../controllers/category.controller.js";
import { isAdmin, verifyJWT } from "../../middlewares/Auth.middleware.js";

const router=Router();
router.use(verifyJWT);

router.route("/createcategory").post(isAdmin,createCategory);
router.route("/getallcategory").get(getAllCategory);
router.route("/categorypagedetails").get(categoryPageDetails);

export default router;