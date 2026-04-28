import { baseApi } from "../baseApi";

interface AddBonusPayload {
    amount: number;
    notes: string;
}

interface AddBonusParams {
    userId: string;
    payload: AddBonusPayload;
}



export const bonusApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create bonus
        addBonus: builder.mutation<any, AddBonusParams>({
            query: ({ userId, payload }) => ({
                url: `user/add-bonus-reward/${userId}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["Bonus"],
        }),
    }),
});

export const { useAddBonusMutation } = bonusApi;