import { Router } from "express";
import { createCourse, getAllCourses, getCourseDetails } from "../../controllers/courses.controller.js";
import { isAdmin, isInstructor, verifyJWT } from "../../middlewares/Auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(isInstructor);

router.route("/createcourse").post(upload.single("thumbnail"),createCourse);
// router.route("/createcourse").post(createCourse); // this is not working
router.route("/getallcoures").get(getAllCourses);
router.route("/getcoursedetails").post(getCourseDetails);

export default router;