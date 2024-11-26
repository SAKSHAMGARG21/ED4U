import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import Ed4u_logo2 from "../../assets/Logo/Ed4u_logo-withbg.png"
import { conf } from "../../utils/constants";
import { resetCart } from "../../slices/cartSlice";


const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src

        script.onload = () => {
            resolve(true)
        }

        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script);
    })
}

export const coursePayment = async (token, courses, userDetails, navigate, dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("RazorPay SDK failed to load");
            return;
        }

        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, { courses }, token);
        console.log("Order Initialized, printing order response", orderResponse);

        if (!orderResponse.data.success) {
            toast.error(orderResponse.data.message);
        }


        const options = {
            key: conf.razorpayKey,
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            name: "Ed4U",
            description: "Thank You for Purchasing the Course",
            image: Ed4u_logo2,
            prefill: {
                name: `${userDetails.fullName}`,
                email: userDetails.email
            },
            handler: (response) => {
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)
                courseVerify({ ...response, courses }, token, navigate, dispatch)
            }
        }

        // Open the modal using options, as order is initialized => payment will be done =>  Payment done mail => verificationPayment => course successfully enrolled mail sent
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", (response) => {
            toast.error("oops, payment failed");
            console.log(response.error);
        })
    } catch (error) {
        console.log("Course Payment Api Error .....", error);
        toast.error("Could not process payment");
    }

    toast.dismiss(toastId);
}

export const courseVerify = async(bodyData,token,navigate,dispatch) => {
    const toastId = toast.loading("Verifying Payment...");
    try {
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData,token);
        console.log(response);

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("Payment successful, you are added to the course!")
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch (error) {
        console.log("Course payment Verify Api Error .....", error);
        toast.error("could not verify payment");
    }

    toast.dismiss((toastId));
}

export const sendPaymentSuccessEmail =async (response,amount,token) => {
    const toastId = toast.loading("Loading...");
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount
        },token);
    } catch (error) {
        console.log("Couse payment sucess Email api Error .....", error);
        toast.error("Could send payment success email");
    }

    toast.dismiss((toastId));
}