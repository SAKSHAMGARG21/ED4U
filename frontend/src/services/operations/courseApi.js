import toast from "react-hot-toast";
import { courseEndpoints, ratingsEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { catalogData } from "../apis";
const {
    GET_ALL_COURSE_API,
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    COURSE_DETAILS_API,
    COURSE_CATEGORIES_API,
    CREATE_SECTION_API,
    UPDATE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SUBSECTION_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    DELETE_COURSE_API,
    GET_FULL_COURSE_DETAILS_usersENTICATED,
    LECTURE_COMPLETION_API,
    CREATE_RATING_API,
} = courseEndpoints

const {
    REVIEWS_DETAILS_API
} = ratingsEndpoints

// CATALOG PAGE DATA
const {
    CATALOGPAGEDATA_API
} = catalogData;

export const reviewDetails = async () => {
    const toastId = toast.loading("Loading...");

    try {

        const res = await apiConnector.get("GET", REVIEWS_DETAILS_API);

        if (!res.data.success) {
            toast.error("Error in getting review details");
        }
    } catch (error) {
        console.log("Review Details Api Error...........", error);
        toast.error("Could not fetch review Details");
    }

    toast.dismiss((toastId));
}

export const getAllCourses = async () => {
    const toastId = toast.loading("Loading...");
    try {
        const res = await apiConnector("GET", GET_ALL_COURSE_API);
        // console.log(res);

        if (!res.data.success) {
            toast.error(res.data.message);
        }


    } catch (error) {
        console.log("Fetch All Courses  Api Error...........", error);
        toast.error("Could not fetch all Course");
    }

    toast.dismiss((toastId));
}
export const createCourse = async (data, token) => {
    const toastId = toast.loading("Loading...");
    let course = null;
    try {
        const res = await apiConnector("POST", CREATE_COURSE_API, data, token);
        console.log(res);

        if (!res.data.success) {
            toast.error(res.data.message);
            console.log(res.data.message);
        }

        course = res.data.data;
    } catch (error) {
        console.log("Create course Api Error...........", error);
        toast.error("Could not fetch ");
    }

    toast.dismiss((toastId));
    return course;
}
export const editCourseDetails = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
        const res = await apiConnector("PATCH", EDIT_COURSE_API, data, token);
        console.log(res);

        if (!res.data.success) {
            toast.error(res.data.message);
        }

        result = res.data.data;
    } catch (error) {
        console.log("Edit Course Api Error...........", error);
        toast.error("Could not fetch ");
    }

    toast.dismiss((toastId));
    return result;
}
export const coureseDetails = async (courseId) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
        const res = await apiConnector("GET", COURSE_DETAILS_API, courseId);
        console.log(res);

        if (!res.data.success) {
            toast.error(res.data.message);
        }

        result = res.data.data;
    } catch (error) {
        console.log("Courese Details Api Error...........", error);
        toast.error("Could not fetch course details");
    }

    toast.dismiss((toastId));

    return result;
}
export const fetchCoureCategories = async () => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
        const res = await apiConnector("GET", COURSE_CATEGORIES_API);
        // console.log(res);

        if (!res.data.success) {
            toast.error(res.data.message);
        }

        result = res.data.data;

    } catch (error) {
        console.log("Couser categories Api Error...........", error);
        toast.error("Could not fetch  Couser Categories");
    }

    toast.dismiss((toastId));
    return result;
}
export const createSection = async (data, token) => {

    let result = null;
    const toastId = toast.loading("Loading...");
    try {
        const res = await apiConnector("POST", CREATE_SECTION_API, data, token);
        console.log(res);

        if (!res.data.success) {
            toast.error(res.data.message);
        }

        result = res?.data?.data?.updatedCourseDetails;
    } catch (error) {
        console.log("create Section Api Error...........", error);
        toast.error("Could not Create Section");
    }

    toast.dismiss((toastId));
    return result;
}
export const updateSection = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
        const res = await apiConnector("PATCH", UPDATE_SECTION_API, data, token);
        console.log(res);

        if (!res.data.success) {
            toast.error(res.data.message);
        }

        result = res.data.data;
    } catch (error) {
        console.log("update section  Api Error ...........", error);
        toast.error("Could not update sectoin data");
    }

    toast.dismiss((toastId));
    return result;
}

export const createSubSection = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
        const res = await apiConnector("POST", CREATE_SUBSECTION_API, data, token);
        console.log(res);

        if (!res.data.success) {
            toast.error(res.data.message);
        }

        result = res?.data?.data?.upatedsection;
    } catch (error) {
        console.log("create subsection  Api Error...........", error);
        toast.error("Could not create subsection ");
    }

    toast.dismiss((toastId));
    return result;
}

export const updateSubSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...");
    try {
        const res = await apiConnector("PATCH", UPDATE_SUBSECTION_API, data, token);
        console.log(res);

        if (!res.data.success) {
            toast.error(res.data.message);
        }

        result = res.data.data;
    } catch (error) {
        console.log("update subsection Api Error...........", error);
        toast.error("Could not update subsection");
    }

    toast.dismiss((toastId));
    return result;
}

export const fetchInstructorCourses = async (token) => {
    let result = [];
    const toastId = toast.loading("Loading...");
    try {
        const res = await apiConnector("GET", GET_ALL_INSTRUCTOR_COURSES_API, {}, token);
        // console.log("Fetch Instructor Courses data ->>>", res);

        if (!res.data.success) {
            toast.error(res.data.message);
        }

        result = res?.data?.data;
    } catch (error) {
        console.log("Fetch Instructor Courses Error Api...........", error);
        toast.error("Could not fetch Instructor courses");
    }

    toast.dismiss((toastId));
    return result;
}

export const deleteSection = async (sectionId, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
        const res = await apiConnector("DELETE", DELETE_SECTION_API, sectionId, token);
        console.log(res);

        if (!res.data.success) {
            toast.error(res.data.message);
        }

        result = res.data.data;
    } catch (error) {
        console.log("delete section  Api Error...........", error);
        toast.error("Could not delete section");
    }

    toast.dismiss((toastId));
    return result;
}

export const deleteSubSection = async (subsectionId, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
        const res = await apiConnector("DELETE", DELETE_SUBSECTION_API, subsectionId, token);
        console.log(res);

        if (!res.data.success) {
            toast.error(res.data.message);
        }

        result = res.data.data;
    } catch (error) {
        console.log("Delete subsection Api Error...........", error);
        toast.error("Could not delete subsection");
    }

    toast.dismiss((toastId));
    return result;
}
export const deleteCourse = async (data, token) => {
    const toastId = toast.loading("Loading...");
    try {
        const res = await apiConnector("DELETE", DELETE_COURSE_API, data, token);
        console.log(res);

        if (!res.data.success) {
            toast.error(res.data.message);
        }
    } catch (error) {
        console.log("Delete course Api Error...........", error);
        toast.error("Could not delet course");
    }
    toast.dismiss((toastId));
}

export const fetchCourseDetails = async (courseId) => {
    const toastId = toast.loading("Loading...");
    let result = null;
    try {
        const res = await apiConnector("POST", COURSE_DETAILS_API, { courseId: courseId });
        console.log(res);

        if (!res.data.success) {
            toast.error(res.data.message)
        }

        result=res.data.data;
    } catch (error) {
        console.log("Fetch course Api Error...........", error);
        toast.error("Could not fetch course");
    }
    toast.dismiss(toastId);
    return result;
}

export const getFullCourseDetails = async (courseId,token) => {
    const toastId = toast.loading("Loading...");
    let result=null;
    try {
        const res = await apiConnector("POST",GET_FULL_COURSE_DETAILS_usersENTICATED,{courseId:courseId},token);
        console.log(res);

        if (!res.data.success) {
            toast.error(res.data.message);
        }

        result=res.data.data;
        console.log(result);

    } catch (error) {
        console.log("fetch full course Details Api Error...........", error);
        toast.error("Could not fetch full course Details");
    }
    toast.dismiss((toastId));
    return result;
}

export const markLectureCompleted= async (data,token)=>{
    const toastId = toast.loading("Loading...");
    let result=null;
    try {

        const res= await apiConnector("PATCH",LECTURE_COMPLETION_API,data,token);
        console.log(res);

        if (!res.data.success){
            toast.error(res.data.message);
        }

        result= res.data.data;
    } catch (error) {
        console.log("make video Completed Api Error...........", error);
        toast.error("Could not make video Completed");
    }
    toast.dismiss(toastId);
    return result;

}

export const getCatelogPageDetails = async (categoryId) => {
    const toastId = toast.loading("loading...");
    let result = null;
    try {
        // console.log(data);
        const res = await apiConnector("POST", CATALOGPAGEDATA_API, { categoryId: categoryId });
        console.log("Category Page Details ->> ", res);

        if (!res.data.success) {
            toast.error(res.data.message);
        }

        result = res.data.data;

    } catch (error) {
        console.log("Get Catelog Details Api Error...........", error);
        toast.error("Could not fetch catelog Details data");
    }

    toast.dismiss(toastId);
    return result;

}


export const createRating = async (courseId,token) => {
    const toastId = toast.loading("Loading...");
    let result= null;
    try {
        const res = await apiConnector("POST",CREATE_RATING_API,{courseId:courseId},token);
        console.log(res);

        if (!res.data.success) {
            toast.error(res.data.message);
        }

        result= res.data.data;

    } catch (error) {
        console.log("Create Rating Api Error...........", error);
        toast.error("Could not Create Rating");
    }

    toast.dismiss((toastId));
    return result;
}


