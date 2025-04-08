import toast from "react-hot-toast";
import { endpoints, settingsEndpoints } from "../apis"
import { apiConnector } from "../apiconnector";
import { setLoading, setUser } from "../../slices/profileSlice";
import { logout } from "./authApi";

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
} = settingsEndpoints;

const { GET_CURR_USER_API}=endpoints;

export const updateDisplayPicture = (token,data) => {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try {
            const res= await apiConnector("PUT",UPDATE_DISPLAY_PICTURE_API,data,token);
            toast.success(res.data.message);
            dispatch(setUser(res.data.data));
            localStorage.setItem("user",JSON.stringify(res.data.data));
        } catch (error) {
            console.log("Api Error in updating Display Picture....", error);
            toast.error("Could't update Profile Picture");
        }

        toast.dismiss((toastId));
        dispatch(setLoading(false));
    }
}
export const updateProfile = () => {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try {

        } catch (error) {
            dispatch(logout(navigate));
            console.log("", error);
            toast.error("");
        }

        toast.dismiss((toastId));
        dispatch(setLoading(false));
    }
}
export const changePassword = () => {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try {

        } catch (error) {
            dispatch(logout(navigate));
            console.log("", error);
            toast.error("");
        }

        toast.dismiss((toastId));
        dispatch(setLoading(false));
    }
}
export const deleteProfile = (token,navigate) => {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try {

            const res= await apiConnector("DELETE",DELETE_PROFILE_API,{},token);
            toast.success(res.data.message);
            dispatch(logout(navigate));
        } catch (error) {
            console.log("Api Error in Deleting User Account...", error);
            toast.error(error.message);
        }

        toast.dismiss((toastId));
        dispatch(setLoading(false));
    }
}