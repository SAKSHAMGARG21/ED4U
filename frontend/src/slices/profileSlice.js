import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading: false,
}


const profieSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
})

export const { setUser, setLoading } = profieSlice.actions;
export default profieSlice.reducer;
