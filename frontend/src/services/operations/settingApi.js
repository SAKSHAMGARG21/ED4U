import toast from "react-hot-toast";
import { settingsEndpoints } from "../apis"

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
} = settingsEndpoints;

export const updateDisplayPicture = () => {
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
export const deleteProfile = () => {
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