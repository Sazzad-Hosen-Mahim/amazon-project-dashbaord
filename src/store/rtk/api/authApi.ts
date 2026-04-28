// src/store/rtk/features/authApi.ts
import { baseApi } from "../baseApi";

export interface LoginPayload {
    phoneNumber: string;
    password: string;
}

export interface User {
    _id: string;
    phoneNumber: string;
    username?: string;
    role: "admin" | "user";
    // Add other user fields as needed
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        userId: number;
        role: "admin" | "user";
    };
}


export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginPayload>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            // Optional: invalidate tags if needed after login
            invalidatesTags: ["User"],
        }),

        // Optional: Add logout endpoint if your backend has one
        logout: builder.mutation<any, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useLoginMutation,
    useLogoutMutation,
} = authApi;