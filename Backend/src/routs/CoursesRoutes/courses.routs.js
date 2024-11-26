import { Router } from "express";
import { createCourse, deleteCourse, getAllCourses, getCourseDetails, getCourseFullDetails, getInstructorCourses, updateCourseDetails } from "../../controllers/courses.controller.js";
import { isAdmin, isInstructor, isStudent, verifyJWT } from "../../middlewares/Auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { updateCourseProgress } from "../../controllers/CourseProgress.controller.js";

const router = Router();

router.route("/createcourse").post(verifyJWT,isInstructor,upload.single("thumbnail"),createCourse);
// router.route("/createcourse").post(createCourse); // this is not working
router.route("/getallcoures").get(getAllCourses);
router.route("/getcoursedetails").post(getCourseDetails);
router.route("/updatecoursedetails").patch(verifyJWT,isInstructor,upload.single("thumbnail"),updateCourseDetails);
router.route("/getinstructorcourses").get(verifyJWT,isInstructor,getInstructorCourses);
router.route("/deletecourse").delete(verifyJWT,isInstructor,deleteCourse);
router.route("/getfullcoursedetails").post(verifyJWT,getCourseFullDetails);

// courseProgress routes
router.route("/updatecourseprogress").patch(verifyJWT,isStudent,updateCourseProgress);
export default router;