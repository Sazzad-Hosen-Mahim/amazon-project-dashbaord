import { baseApi } from "../baseApi";

export interface Product {
    _id: string;
    productId: number;
    status: string;
    name: string;
    price: number;
    commission: number;
    salePrice: number;
    introduction: string;
    poster: string;
    isAdminAssigned: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ProductListResponse {
    success: boolean;
    message?: string;
    data: Product[];
    meta?: PaginationMeta;
}

export interface CreateProductPayload {
    name: string;
    introduction: string;
    poster: File;
}

export interface UpdateProductPayload {
    productId: number;
    name?: string;
    price?: string | number;
    commission?: string | number;
    salePrice?: string | number;
    introduction?: string;
    poster?: File | null;
}

// Updated interface to include price filters
export interface GetAllProductsParams {
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
}

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllProducts: builder.query<ProductListResponse, GetAllProductsParams>({
            query: (params) => {
                const queryParams: Record<string, any> = {
                    page: params.page ?? 1,
                    limit: params.limit ?? 10,
                };

                if (params.minPrice !== undefined && params.minPrice !== null) {
                    queryParams.minPrice = params.minPrice;
                }
                if (params.maxPrice !== undefined && params.maxPrice !== null) {
                    queryParams.maxPrice = params.maxPrice;
                }

                return {
                    url: "/product/getAllProduct",
                    method: "GET",
                    params: queryParams,
                };
            },
            transformResponse: (response: { success: boolean; data: Product[] }, _meta, arg) => {
                const page = arg.page || 1;
                const limit = arg.limit || 10;
                const dataLength = response.data?.length || 0;

                const isLastPage = dataLength < limit;
                const totalPages = isLastPage ? page : page + 1;
                const total = isLastPage ? ((page - 1) * limit) + dataLength : page * limit + 1;

                return {
                    success: response.success,
                    data: response.data || [],
                    meta: {
                        page,
                        limit,
                        totalPages,
                        total,
                    },
                };
            },
            providesTags: ["Product"],
        }),

        createProduct: builder.mutation<Product, CreateProductPayload>({
            query: (data) => {
                const formData = new FormData();
                formData.append("name", data.name);
                formData.append("introduction", data.introduction);
                formData.append("poster", data.poster);

                return {
                    url: "/product/create-product",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["Product"],
        }),

        updateProduct: builder.mutation<Product, UpdateProductPayload>({
            query: ({ productId, ...data }) => {
                const formData = new FormData();
                if (data.name) formData.append("name", data.name);
                if (data.price !== undefined) formData.append("price", String(data.price));
                if (data.commission !== undefined) formData.append("commission", String(data.commission));
                if (data.salePrice !== undefined) formData.append("salePrice", String(data.salePrice));
                if (data.introduction) formData.append("introduction", data.introduction);
                if (data.poster) formData.append("poster", data.poster);

                return {
                    url: `/product/update-product/${productId}`,
                    method: "PATCH",
                    body: formData,
                };
            },
            invalidatesTags: ["Product"],
        }),

        deleteProduct: builder.mutation<void, number>({
            query: (productId) => ({
                url: `/product/delete-product/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),
    }),

    overrideExisting: false,
});

export const {
    useGetAllProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;