import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../../features/auth/authSilce";
import conf from "../../conf/conf";
import { createApi } from "@reduxjs/toolkit/query";
import { combineSlices } from "@reduxjs/toolkit";

// const baseQuery = fetchBaseQuery({
//     baseUrl: conf.bkurl,
//     credentials: 'include',
//     prepareHeaders:(headers ,{getState})=>{
//         const token= getState().auth.token
//         if (token){
//             headers.set("authorization",`Bearer ${token}`);
//         }
//         return headers;
//     }
// })

// const baseQueryReauth=async(args,api,extraOptions)=>{
//     let result=await baseQuery(args,api,extraOptions)
//     if (result?.error?.originalStatus===401){
//         console.log('sending refresh token');
//         const refreshResult= await baseQuery('/users/refreshToken',api,extraOptions);
//         console.log(refreshResult);
//         if (refreshResult?.data){
//             const user= api.getState().auth.user;
//             api.dispatch(setCredentials({...refreshResult.data,user}));
//             result=await baseQuery(args,api,extraOptions);
//         }
//         else{
//             api.dispatch(logout());
//         }
//     }
//     return result;
// }

// export const apiSlice= createApi({
//     baseQuery:baseQueryReauth,
//     endpoints:builder=>({}) 
// })
// console.log(apiSlice);


const baseQuery = fetchBaseQuery({
    baseUrl: conf.bkurl,
  });
  
  async function baseQueryWithAuth(args, api, extra) {
    const result = await baseQuery(args, api, extra);
    // Dispatch the logout action on 401.
    if (result.error && result.error.status === 401) {
      api.dispatch(logout());
    }
    return result;
  }
  
  export const apiSlice = createApi({
    baseQuery: baseQueryWithAuth, // Use the customized baseQuery
    tagTypes: ['Product', 'Order', 'User'],
    endpoints: (builder) => ({}),
  });