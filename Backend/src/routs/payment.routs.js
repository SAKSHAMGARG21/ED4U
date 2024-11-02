import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { capturePayment, verifySignature } from "../controllers/payment.controller.js";

const router = Router();
router.use(verifyJWT);
router.route("/capturepayment").post(capturePayment);
router.route("/verifysignature").get(verifySignature);

export default router;
