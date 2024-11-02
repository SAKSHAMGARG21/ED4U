import { Router } from "express";
import { isInstructor, verifyJWT } from "../../middlewares/Auth.middleware.js";
import { createSubSection,deleteSubSection,upateSubSection } from "../../controllers/subSection.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
const router = Router();
router.use(verifyJWT);
router.use(isInstructor);
router.route("/createsubsection").post(upload.single("videoFile"),createSubSection);
// router.route("/createsubsection").post(createSubSection);
router.route("/updatesubsection").patch(upateSubSection);
router.route("/deletesubsection").delete(deleteSubSection);

export default router;
