import { baseApi } from "../baseApi";

// Types
export interface Withdrawal {
    _id: string;
    userId: number;
    amount: number;
    transactionStatus: "APPROVED" | "REJECTED" | "PENDING";
    superiorUserName: string; // "Admin"
    name: string;
    mobile: string;

    // Common
    withdrawalAmount: number;
    totalRechargeAmount: number;
    totalWithdrawalAmount: number;
    applicationTime: string;
    processingTime?: string; // "2026-01-28T14:21:41.845Z"
    createdAt: string;
    updatedAt: string;
    reviewRemark?: string;

    // Method Type
    withdrawMethod: "BankTransfer" | "MobileBanking";

    // Bank Transfer Fields
    bankName?: string;
    bankAccountNumber?: number;
    branchName?: string;
    district?: string;

    // Mobile Banking Fields
    mobileBankingName?: string;
    mobileBankingAccountNumber?: number;
    mobileUserDistrict?: string;

    // Legacy or Optional (kept just in case)
    withdrawalFee?: number;
    actualAmount?: number;
    withdrawalAddress?: string;
}

export interface GetAllWithdrawsParams {
    page?: number;
    limit?: number;
    userId?: number;
    orderNumber?: string;
    name?: string;
    mobile?: string;
    orderAmount?: number;
    screenAmount?: number;
    transactionStatus?: "APPROVED" | "REJECTED" | "PENDING";
    phoneLast4?: string;
}

export interface GetAllWithdrawsResponse {
    success: boolean;
    message: string;
    data: Withdrawal[];
}

export interface GetSingleWithdrawResponse {
    success: boolean;
    message: string;
    data: Withdrawal;
}

export interface CreateWithdrawPayload {
    userId: number;
    amount: number;
}

export interface AcceptWithdrawPayload {
    userId: number;
    amount: number;
}

export interface RejectWithdrawPayload {
    reviewRemark: string;
}

export interface UpdateWithdrawalAddressPayload {
    name: string;
    withdrawMethod: "BankTransfer" | "MobileBanking";
    // Bank Transfer fields
    bankName?: string;
    bankAccountNumber?: number;
    branchName?: string;
    district?: string;
    // Mobile Banking fields
    mobileBankingName?: string;
    mobileBankingAccountNumber?: number;
}

// New types for Superior User Recharge/Withdraw
export interface SuperiorUserRechargeWithdraw {
    superiorUserId: string;
    period: string;
    totalRecharge: number;
    totalWithdraw: number;
}

export interface GetSuperiorUserRechargeWithdrawParams {
    filterSuperiorUserId?: string;
    groupBy?: "day" | "month";
}

export interface GetSuperiorUserRechargeWithdrawResponse {
    success: boolean;
    message: string;
    data: SuperiorUserRechargeWithdraw[];
}

// New types for Platform Totals
export interface PlatformRechargeWithdraw {
    totalRecharge: number;
    totalWithdraw: number;
}

export interface GetPlatformRechargeWithdrawResponse {
    success: boolean;
    message: string;
    data: PlatformRechargeWithdraw;
}

export const withdrawApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create withdrawal
        createWithdraw: builder.mutation<any, CreateWithdrawPayload>({
            query: (payload) => ({
                url: "/withdraw/create-withdraw",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Withdraw"],
        }),

        // Get all withdrawals with pagination
        getAllWithdraws: builder.query<GetAllWithdrawsResponse, GetAllWithdrawsParams>({
            query: ({
                page = 1,
                limit = 10,
                transactionStatus,
                userId,
                phoneLast4,
                orderNumber,
                name,
                orderAmount,
                screenAmount
            }) => ({
                url: `/withdraw/getAll`,
                params: {
                    page,
                    limit,
                    ...(transactionStatus && { transactionStatus }),
                    ...(userId && { userId }),
                    ...(phoneLast4 && { phoneLast4 }),
                    ...(orderNumber && { orderNumber }),
                    ...(name && { name }),
                    ...(orderAmount && { orderAmount }),
                    ...(screenAmount && { screenAmount }),
                },
                method: "GET",
            }),
            providesTags: ["Withdraw"],
        }),

        // Get single user's withdrawals
        getSingleUserWithdraws: builder.query<GetSingleWithdrawResponse, string>({
            query: (id) => ({
                url: `/withdraw/getSingleWithdraw/${id}`,
                method: "GET",
            }),
            providesTags: ["Withdraw"],
        }),

        // Accept withdrawal
        acceptWithdraw: builder.mutation<any, { id: string; payload: AcceptWithdrawPayload }>({
            query: ({ id, payload }) => ({
                url: `/withdraw/accept/${id}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Withdraw"],
        }),

        // Reject withdrawal
        rejectWithdraw: builder.mutation<any, { id: string; payload: RejectWithdrawPayload }>({
            query: ({ id, payload }) => ({
                url: `/withdraw/reject/${id}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Withdraw"],
        }),

        // Update withdrawal address
        updateWithdrawalAddress: builder.mutation<any, { userId: number; payload: UpdateWithdrawalAddressPayload }>({
            query: ({ userId, payload }) => ({
                url: `/user/update-withdrawal-address/${userId}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Member"],
        }),

        // Get superior user recharge and withdraw data
        getSuperiorUserRechargeWithdraw: builder.query<
            GetSuperiorUserRechargeWithdrawResponse,
            GetSuperiorUserRechargeWithdrawParams
        >({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params.filterSuperiorUserId) {
                    queryParams.append("filterSuperiorUserId", params.filterSuperiorUserId);
                }
                if (params.groupBy) {
                    queryParams.append("groupBy", params.groupBy);
                }
                const queryString = queryParams.toString();
                return {
                    url: `/user/get-superior-user-recharge-withdraw${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Withdraw"],
        }),

        // Get platform recharge and withdraw totals
        getPlatformRechargeWithdraw: builder.query<GetPlatformRechargeWithdrawResponse, void>({
            query: () => ({
                url: "/user/get-platform-recharge-withdraw",
                method: "GET",
            }),
            providesTags: ["Withdraw"],
        }),
    }),
});

export const {
    useCreateWithdrawMutation,
    useGetAllWithdrawsQuery,
    useGetSingleUserWithdrawsQuery,
    useAcceptWithdrawMutation,
    useRejectWithdrawMutation,
    useUpdateWithdrawalAddressMutation,
    useGetSuperiorUserRechargeWithdrawQuery,
    useGetPlatformRechargeWithdrawQuery,
} = withdrawApi;