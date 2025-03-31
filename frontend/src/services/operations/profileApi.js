
import toast from "react-hot-toast";
import { setLoading } from "../../slices/profileSlice";
import { contactusEndpoint, profileEndpoints } from "../apis"
import { apiConnector } from "../apiconnector";
const {
    GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
    GET_INSTRUCTOR_DATA_API
} = profileEndpoints

// const { CONTACT_US_API } = contactusEndpoint;


export const getUserDetails =async (token, navigate) => {
    const toastId = toast.loading("Loading...");

    try {

        const response = await apiConnector("GET", GET_USER_DETAILS_API, null,token);
        console.log(response);
        if (!response.data.success) {
            toast.error("Not get user details");
        }

        toast.success("User Details fetched successfully");
        navigate("/dashboard/my-profile");
    } catch (error) {
        dispatch(logout(navigate))
        console.log("GET_USER_DETAILS API ERROR............", error)
        toast.error("Could Not Get User Details")
    }

    toast.dismiss(toastId);

}

export const getUserEnrolledCourses =async (token) => {
    const toastId = toast.loading("Loading...");

    let result=null;
    try {
        const res= await apiConnector("GET",GET_USER_ENROLLED_COURSES_API,{},token);
        console.log(res);

        if (!res.data.success){
            // toast.error("User Enrolled Courses Data not found");   
            toast.error(res.data.message);   
        }

        result=res.data.data;
    } catch (error) {
        console.log("Get User Details Api Error.......", error);
        toast.error("Could Not Get User Details");
    }

    toast.dismiss((toastId));

    return result;

}

export const getInstructorData = async(token) => {
    const toastId = toast.loading("Loading...");
    let result= null;
    try {
        const res= await apiConnector();

        if (!res.data.success){
            toast.error(res.data.message);
        }

        result = res.data.data;


    } catch (error) {
        console.log("Get Instructor Data Api Error.......", error);
        toast.error("Could Not Get Instructor Data");
    }

    toast.dismiss((toastId));
    return result;

}

export const contactUs = () => {
    const toastId = toast.loading("Loading...");
    try {

    } catch (error) {
        console.log("", error);
        toast.error("");
    }

    toast.dismiss((toastId));

}
