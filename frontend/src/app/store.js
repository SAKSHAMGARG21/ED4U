// import {configureStore} from "@reduxjs/toolkit";
// import userReducer from "../store/authSilce";
// const store = configureStore({
//     reducer:userReducer
// })

// export default store;

import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from "../features/auth/authSilce"


const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});


export default store;