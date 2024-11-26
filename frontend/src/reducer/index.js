import { combineReducers } from "@reduxjs/toolkit";

import authSlice from "../slices/authSlice"
import profileSlice from "../slices/profileSlice"
import courseSlice from "../slices/courseSlice"
import cartSlice from "../slices/cartSlice"
import viewCourseSlice from "../slices/viewCourseSlice"
const rootReducer = combineReducers({
    auth: authSlice,
    profile: profileSlice,
    course: courseSlice,
    cart: cartSlice,
    viewCourse: viewCourseSlice
})

export default rootReducer;
