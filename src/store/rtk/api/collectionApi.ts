// src/store/rtk/features/collectionApi.ts
import { baseApi } from "../baseApi";

export interface UpdateAdminAssignedProductPayload {
    productId: number;
    orderNumber: number;
    mysteryboxMethod?: string;
    mysteryboxAmount?: string;
}

export interface UpdateAdminAssignedProductPayload {
    productId: number;
    orderNumber: number;
    mysteryboxMethod?: string;
    mysteryboxAmount?: string;
}

export interface UpdateAdminAssignedProductResponse {
    success: boolean;
    message: string;
    data?: any;
}

export const collectionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateAdminAssignedProduct: builder.mutation<
            UpdateAdminAssignedProductResponse,
            { userId: string; product: UpdateAdminAssignedProductPayload }  // <-- changed
        >({
            query: ({ userId, product }) => ({
                url: `/user/update-admin-assigned-product/${userId}`,
                method: "PATCH",
                body: product,  // <-- send single object, not array
            }),
            invalidatesTags: ["Product", "User"], // add more tags if needed
        }),

        // Optional: add a separate bulk endpoint if backend supports it later
    }),
    overrideExisting: false,
});

export const {
    useUpdateAdminAssignedProductMutation,
} = collectionApi;