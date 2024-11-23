import { Router } from "express";
import { isStudent, verifyJWT } from "../middlewares/Auth.middleware.js";
import { capturePayment, sendPaymentSuccessEmail, verifySignature } from "../controllers/payment.controller.js";

const router = Router();
router.use(verifyJWT);
router.use(isStudent);

router.route("/capturepayment").post(capturePayment);
router.route("/verifysignature").post(verifySignature);
router.route("/sendpaymentsuccessemail").post(sendPaymentSuccessEmail);

export default router;
