import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null
}

const userSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const {user,accessToken} = action.payload 
            state.user = user,
            state.token = accessToken
        },
        logout: (state) => {
            state.user= null
            state.token = null;
        }
    }
})

export const { setCredentials, logout } = userSlice.actions;
export default userSlice.reducer; 

export const selectCurrUser=((state)=>state.auth.user);
export const selectCurrToken=((state)=>state.auth.token);
