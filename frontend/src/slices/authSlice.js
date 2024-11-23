import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    signupData: null,
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
    loding: false
}

const authSilce = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setSignupData: (state, action)=>{
            state.signupData = action.payload
        },
        setToken: (state, action)=>{
            state.token = action.payload
        },
        setLoding: (state, action)=>{
            state.loding = action.payload
        }
    }
})

export const {setSignupData,setToken,setLoding} =  authSilce.actions;

export  default authSilce.reducer;
