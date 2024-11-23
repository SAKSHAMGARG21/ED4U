import { Router } from "express";
import { deleteAccount, getallUsersDetails, getenrolledUserCourses, instructorDashboard, updateDisplayPicture, updateProfile } from "../controllers/profile.controller.js";
import { isInstructor, verifyJWT } from "../middlewares/Auth.middleware.js";
const router = Router();
router.use(verifyJWT);
router.route("/getalluserdetails").get(getallUsersDetails);
router.route("/updateprofile").post(updateProfile);
router.route("/deleteaccount").delete(deleteAccount);

router.route("/getenrolledcourses").get(getenrolledUserCourses);
// router.put("/updatedisplaypicture").post(updateDisplayPicture);
// router.get("/instructordashboard").get(isInstructor, instructorDashboard);
export default router;
