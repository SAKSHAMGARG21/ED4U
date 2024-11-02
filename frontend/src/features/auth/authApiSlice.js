import { apiSlice } from "../../app/api/apiSlice"
import conf from "../../conf/conf"

// export const authApiSlice = apiSlice.injectEndpoints({
//     endpoints: builder => ({
//         login: builder.mutation({
//             query: credentials => ({
//                 url: `${conf.bkurl}/users/login`,
//                 method: 'POST',
//                 body: { ...credentials }
//             })
//         })
//     })
// })

// console.log(authApiSlice);

// export const { 
//     useLoginMutation
// } = authApiSlice;

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${conf.bkurl}/auth`,
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useGetUserDetailsQuery,
} = userApiSlice;
