import { Router } from "express";
import { deleteAccount, getallUsersDetails, updateProfile } from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
const router = Router();
router.use(verifyJWT);
router.route("/updateprofile").post(updateProfile);
router.route("/deleteaccount").delete(deleteAccount);
router.route("/getalluserdetails").get(getallUsersDetails)

export default router;
