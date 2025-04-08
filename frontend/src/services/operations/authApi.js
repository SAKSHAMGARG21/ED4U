import toast from "react-hot-toast";
import { setLoding, setToken } from "../../slices/authSlice";
import { endpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { setUser } from "../../slices/profileSlice";
import axios from "axios";

export const sendOtp = (email, navigate) => {
    return async (dispatch) => {
        const tostId = toast.loading("Loading...")
        dispatch(setLoding(true));

        try {
            const response = await apiConnector('POST', endpoints.SENDOTP_API, { email, checkUserPresent: true })
            console.log("Send api response ", response);
            if (!response.data.success) {
                toast.error("Failed to send OTP");
            }
            toast.success("OTP send Successfully");
            navigate("/verify-email");
        } catch (error) {
            console.log("Send otp Api error ....", error);
            toast.error("Could not Send OTP");
        }
        dispatch(setLoding(false));
        toast.dismiss(tostId);
    }
}

export const signUp = (userName, fullName, email, password, accountType, otp, navigate) => {
    return async (dispatch) => {
        const tostId = toast.loading("Loading...");
        dispatch(setLoding(true));

        try {
            const response = await apiConnector("POST", endpoints.SIGNUP_API, { userName, fullName, email, password, accountType, otp });
            // console.log(response);
            if (!response.data.success) {
                toast.error("Failed to signup");
            }

            toast.success("Signup Successfully");
            navigate("/login");
        } catch (error) {
            console.log("Api Error while Signup the User....", error);
            toast.error("Could not Signup User");
        }

        dispatch(setLoding(false));
        toast.dismiss(tostId);
    }
}


export const login = (email, password, navigate) => {
    return async (dispatch) => {
        const tostId = toast.loading("Loading...");
        dispatch(setLoding(true));
        try {

            const response = await axios.post(endpoints.LOGIN_API, { email, password });
            if (!response.data.success) {
                toast.error("Failed to login");
            }

            toast.success("Logged in Successfully");
            dispatch(setToken(response.data.data.refreshToken));
            const userImage = response.data.data.user.avtar;
            dispatch(setUser({ ...response.data.data.user, image: userImage }))
            localStorage.setItem("token", JSON.stringify(response.data.data.refreshToken))
            localStorage.setItem("user", JSON.stringify(response.data.data.user));
            navigate("/");
        } catch (error) {
            console.log("Api Error while Login the User....", error);
            toast.error("Could not Login User");
        }

        dispatch(setLoding(false));
        toast.dismiss(tostId);
    }
}

export const logout = (navigate) => {
    return async (dispatch) => {
        const tostId = toast.loading("Loading...");
        dispatch(setLoding(true));

        try {
            dispatch(setToken(null));
            dispatch(setUser(null));
            // dispatch(resetCart());
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.success("Logged Out");
            navigate("/");
        } catch (error) {
            console.log("Api Error while logout the User....", error);
            toast.error("Could not Logout User");
        }

        dispatch(setLoding(false));
        toast.dismiss(tostId);
    }
}

export const resetPasswordSendMail = (email, setEmailSent) => {
    return async (dispatch) => {

        const toastId = toast.loading("Loading...");
        dispatch(setLoding(true));
        try {
            const response = await apiConnector("POST", endpoints.RESETPASSTOKEN_API, { email });
            console.log(response);

            if (!response.data.success) {
                throw toast.error("Could Not Send Mail");
            }

            toast.success("Mail Send Successfully");
            setEmailSent(true);
        }
        catch (error) {
            console.log("Api Error while Send Mail for Reset Password...->", error);
            toast.error("Could not Send Mail for Reset Password");
        }

        toast.dismiss(toastId);
        dispatch(setLoding(false));
    }
}

export const updatePassword = (password, token, navigate) => {
    return async (dispatch) => {

        const toastId = toast.loading("Loading...");
        dispatch(setLoding(true));
        try {

            const response = await apiConnector("POST", endpoints.RESETPASSWORD_API, { password, token });
            console.log(response);

            if (!response.data.success) {
                throw toast.error("Could change Password");
            }

            toast.success("Password Change Successfully");
            navigate("/resetcomplete");
        } catch (error) {
            console.log("Api Error while Changing Password....", error);
            toast.error("Could not Change Password");
        }

        toast.dismiss(toastId);
        dispatch(setLoding(false));
    }
}

