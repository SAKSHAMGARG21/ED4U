import { Router } from "express";
import { verifyJWT } from "../../middlewares/Auth.middleware.js";
import { createSection, deleteSection, updateSection } from "../../controllers/section.controller.js";
const router = Router();
router.use(verifyJWT);
router.route("/createsection").post(createSection);
router.route("/updatesection").patch(updateSection);
router.route("/deletesection").delete(deleteSection);

export default router;
