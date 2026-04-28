// src/store/rtk/api/memberApi.ts
import type { User } from "@/types/user";
import { baseApi } from "../baseApi";

export interface CreateMemberPayload {
    phoneNumber: string;
    email?: string;
    password: string;
    confirmPassword: string;
    invitationCode: string;
}

export interface CreateMemberResponse {
    success: boolean;
    message: string;
    data?: {
        user: User;
    };
}

export interface GetMembersParams {
    page?: number;
    limit?: number;
    userId?: string;
    userType?: string;
    name?: string;
    ip?: string;
    phoneLast4?: string;
}

export interface GetMembersResponse {
    success: boolean;
    data: User[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}

export interface AddAmountPayload {
    userId: string | number;
    amount: number;
}

export interface AddAmountResponse {
    success: boolean;
    message: string;
    data?: User;
}

export interface DecreaseAmountPayload {
    userId: string | number;
    amount: number;
}

export interface DecreaseAmountResponse {
    success: boolean;
    message: string;
    data?: User;
}

export interface FreezeUserPayload {
    isFreeze: boolean;
}

export interface FreezeUserResponse {
    success: boolean;
    message: string;
    data?: User;
}

export interface UpdateOrderAmountSlotPayload {
    amount: number[];
}

export interface UpdateOrderAmountSlotResponse {
    success: boolean;
    message: string;
    data?: User;
}

export interface UpdateOrderRoundPayload {
    round: "trial" | "round_one" | "round_two";
    status: boolean;
}

export interface UpdateOrderRoundResponse {
    success: boolean;
    message: string;
    data: null | any;
}

export interface UpdateScorePayload {
    score: number;
}

export interface UpdateScoreResponse {
    success: boolean;
    message: string;
    data?: User;
}

export interface FreezeWithdrawPayload {
    freezeWithdraw: boolean;
}

export interface FreezeWithdrawResponse {
    success: boolean;
    message: string;
    data?: User;
}

export interface isOnlinePayload {
    isOnline: boolean;
}

export interface isOnlineResponse {
    success: boolean;
    message: string;
    data?: User;
}

export interface UpdatePasswordPayload {
    newPassword: string;
}

export interface UpdatePasswordResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface UpdateLevelPayload {
    level: number;
}

export interface UpdateLevelResponse {
    success: boolean;
    message: string;
    data?: User;
}

export interface AddCashbackPayload {
    cashbackAmount: number;
}

export interface AddCashbackResponse {
    success: boolean;
    message: string;
    data?: User;
}

export interface AssignProductItem {
    productId: string;
    price: number;
    commission: number;
}

export interface AssignProductsPayload {
    userId: number;
    type: string;
    products: AssignProductItem[];
}

export interface UpdateProductPriceItem {
    productItemId: string;
    price: number;
    commission?: number;
}

export interface UpdateMultipleProductPricesPayload {
    selectedProductsId: string;
    updatesProductPrices: UpdateProductPriceItem[];
}

export const memberApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createMember: builder.mutation<CreateMemberResponse, CreateMemberPayload>({
            query: (payload) => ({
                url: "/user/create",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Member"],
        }),

        getMembers: builder.query<GetMembersResponse, GetMembersParams>({
            query: (params) => {
                const queryParams = new URLSearchParams();

                queryParams.append('page', (params.page || 1).toString());
                queryParams.append('limit', (params.limit || 10).toString());
                if (params.userId) queryParams.append('userId', params.userId);
                if (params.userType) queryParams.append('userType', params.userType);
                if (params.name) queryParams.append('name', params.name);
                if (params.ip) queryParams.append('ip', params.ip);
                if (params.phoneLast4) queryParams.append('phoneLast4', params.phoneLast4);

                return {
                    url: `/user/getAll?${queryParams.toString()}`,
                    method: "GET",
                };
            },
            transformResponse: (response: { success: boolean; data: User[] }, _meta, arg) => {
                const page = arg.page || 1;
                const limit = arg.limit || 10;
                const dataLength = response.data?.length || 0;

                const isLastPage = dataLength < limit;
                const totalPages = isLastPage ? page : page + 1;
                const total = isLastPage ? ((page - 1) * limit) + dataLength : page * limit + 1;

                return {
                    success: response.success,
                    data: response.data || [],
                    page,
                    limit,
                    totalPages,
                    total,
                };
            },
            providesTags: ["Member"],
        }),

        addAmount: builder.mutation<AddAmountResponse, AddAmountPayload>({
            query: ({ userId, amount }) => ({
                url: `/user/recharge/${userId}`,
                method: "PUT",
                body: { amount },
            }),
            invalidatesTags: ["Member"],
        }),

        decreaseAmount: builder.mutation<DecreaseAmountResponse, DecreaseAmountPayload>({
            query: ({ userId, amount }) => ({
                url: `/user/decrease/${userId}`,
                method: "PUT",
                body: { amount },
            }),
            invalidatesTags: ["Member"],
        }),

        freezeUser: builder.mutation<FreezeUserResponse, { userId: string | number; payload: FreezeUserPayload }>({
            query: ({ userId, payload }) => ({
                url: `/user/freeze/${userId}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["Member"],
        }),

        updateOrderAmountSlot: builder.mutation<
            UpdateOrderAmountSlotResponse,
            { userId: string | number; payload: UpdateOrderAmountSlotPayload }
        >({
            query: ({ userId, payload }) => ({
                url: `/user/update-order-amount/${userId}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Member"],
        }),

        updateOrderRound: builder.mutation<
            UpdateOrderRoundResponse,
            { userId: string | number; payload: UpdateOrderRoundPayload }
        >({
            query: ({ userId, payload }) => ({
                url: `/user/admin-order-enable-round/${userId}`,
                method: "PUT",
                body: payload,
            }),
            invalidatesTags: ["Member"],
        }),

        updateScore: builder.mutation<
            UpdateScoreResponse,
            { userId: string | number; payload: UpdateScorePayload }
        >({
            query: ({ userId, payload }) => ({
                url: `/user/update-score/${userId}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Member"],
        }),

        freezeWithdraw: builder.mutation<
            FreezeWithdrawResponse,
            { userId: string | number; payload: FreezeWithdrawPayload }
        >({
            query: ({ userId, payload }) => ({
                url: `/user/udpate-freeze-withdraw/${userId}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Member"],
        }),

        updatePasswordFromAdmin: builder.mutation<
            UpdatePasswordResponse,
            { userId: string | number; payload: UpdatePasswordPayload }
        >({
            query: ({ userId, payload }) => ({
                url: `/user/update-password-from-admin/${userId}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Member"],
        }),

        updateLevel: builder.mutation<
            UpdateLevelResponse,
            { userId: string | number; payload: UpdateLevelPayload }
        >({
            query: ({ userId, payload }) => ({
                url: `/user/update-level/${userId}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Member"],
        }),

        addCashback: builder.mutation<
            AddCashbackResponse,
            { userId: string | number; payload: AddCashbackPayload }
        >({
            query: ({ userId, payload }) => ({
                url: `/user/add-cashback/${userId}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Member"],
        }),

        assignProducts: builder.mutation<any, AssignProductsPayload>({
            query: (payload) => ({
                url: "/user/assignProducts",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Member"],
        }),

        updateMultipleProductPrices: builder.mutation<any, UpdateMultipleProductPricesPayload>({
            query: (payload) => ({
                url: "/user/update-multiple-product-prices",
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Member"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useCreateMemberMutation,
    useGetMembersQuery,
    useAddAmountMutation,
    useDecreaseAmountMutation,
    useFreezeUserMutation,
    useUpdateOrderAmountSlotMutation,
    useUpdateOrderRoundMutation,
    useUpdateScoreMutation,
    useFreezeWithdrawMutation,
    useUpdatePasswordFromAdminMutation,
    useUpdateLevelMutation,
    useAddCashbackMutation,
    useAssignProductsMutation,
    useUpdateMultipleProductPricesMutation,
} = memberApi;