import { conf } from "../utils/constants";

const BASE_URL = conf.bkurl;
// users ENDPOINTS
export const endpoints = {
    SENDOTP_API: BASE_URL + "/users/sendotp",
    SIGNUP_API: BASE_URL + "/users/regester",
    LOGIN_API: BASE_URL + "/users/login",
    RESETPASSTOKEN_API: BASE_URL + "/users/resetPassword",
    RESETPASSWORD_API: BASE_URL + "/users/forgot-password",
    GET_CURR_USER_API: BASE_URL + "/users/current-user"
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
    GET_USER_DETAILS_API: BASE_URL + "/profile/getalluserdetails",
    GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getenrolledcourses",
    GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
}

// STUDENTS ENDPOINTS
export const studentEndpoints = {
    COURSE_PAYMENT_API: BASE_URL + "/payment/capturepayment",
    COURSE_VERIFY_API: BASE_URL + "/payment/verifysignature",
    SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendpaymentsuccessemail",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
    GET_ALL_COURSE_API: BASE_URL + "/course/getallcoures",
    CREATE_COURSE_API: BASE_URL + "/course/createcourse",
    EDIT_COURSE_API: BASE_URL + "/course/updatecoursedetails",
    COURSE_DETAILS_API: BASE_URL + "/course/getcoursedetails",
    GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getinstructorcourses",
    DELETE_COURSE_API: BASE_URL + "/course/deletecourse",
    LECTURE_COMPLETION_API: BASE_URL + "/course/updatecourseprogress",
    GET_FULL_COURSE_DETAILS_usersENTICATED: BASE_URL + "/course/getfullcoursedetails",

    COURSE_CATEGORIES_API: BASE_URL + "/category/getallcategory",

    CREATE_SECTION_API: BASE_URL + "/section/createsection",
    UPDATE_SECTION_API: BASE_URL + "/section/updatesection",
    DELETE_SECTION_API: BASE_URL + "/section/deletesection",

    CREATE_SUBSECTION_API: BASE_URL + "/subsection/createsubsection",
    UPDATE_SUBSECTION_API: BASE_URL + "/subsection/updatesubsection",
    DELETE_SUBSECTION_API: BASE_URL + "/subsection/deletesubsection",
    
    CREATE_RATING_API: BASE_URL + "/ratingandreview/createrating",
}

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
    REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
}

// CATAGORIES API
export const categories = {
    CATEGORIES_API: BASE_URL + "/category/getallcategory",
}

// CATALOG PAGE DATA
export const catalogData = {
    CATALOGPAGEDATA_API: BASE_URL + "/category/categorypagedetails",
}
// CONTACT-US API
export const contactusEndpoint = {
    CONTACT_US_API: BASE_URL + "/reach/contact",
}

// SETTINGS PAGE API
export const settingsEndpoints = {
    UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
    UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
    CHANGE_PASSWORD_API: BASE_URL + "/users/changepassword",
    DELETE_PROFILE_API: BASE_URL + "/profile/deleteaccount",
}