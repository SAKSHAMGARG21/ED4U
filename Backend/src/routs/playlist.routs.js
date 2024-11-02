import { Router } from "express"
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { addvideoinplaylist, createplaylist, deleteplaylist, deletevideofromplaylist, getuserAllplaylist, updateplaylist } from "../controllers/playlist.controller.js";

const router=Router();
router.use(verifyJWT);

router.route("/userallplaylist").get(getuserAllplaylist);
router.route("/createplaylist").post(createplaylist);
router.route("/deleteplaylist/:id").delete(deleteplaylist);
router.route("/addvideoinplaylist/:id").post(addvideoinplaylist);
router.route("/deletevideofromplaylist/:id").delete(deletevideofromplaylist);
router.route("/updateplaylist/:id").patch(updateplaylist);

export default router;