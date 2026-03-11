
import { baseApi } from '../index';
import { FilterBaseModel, ProductFilterGroup, ProductFiltersModel, ProductType } from '@constants/index';

export interface UpdateProductRequest extends Partial<ProductType> {
    id: string;
}

export interface UploadImageResponse {
    message: string;
    url: string;
    publicId: string;
}

export interface CreateFilterOptionRequest {
    group: ProductFilterGroup;
    code: string;
    tr: string;
    en: string;
}

export interface DeleteFilterOptionRequest {
    group: ProductFilterGroup;
    code: string;
}

export const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all products
        getAllProducts: builder.query<ProductType[], void>({
            query: () => '/api/products',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Products' as const, id })),
                        { type: 'Products', id: 'LIST' },
                    ]
                    : [{ type: 'Products', id: 'LIST' }],
        }),

        // Get single product
        getProductById: builder.query<ProductType, string>({
            query: (id) => `/api/products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Products', id }],
        }),

        // Create product
        createProduct: builder.mutation<ProductType, ProductType>({
            query: (body) => ({
                url: '/api/products',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Products', id: 'LIST' }],
        }),

        // Update product
        updateProduct: builder.mutation<ProductType, UpdateProductRequest>({
            query: (req) => (
                
                {
                url: `/api/products/${req.id}`,
                method: 'PUT',
                body: req,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Products', id },
                { type: 'Products', id: 'LIST' },
            ],
        }),

        // Delete product
        deleteProduct: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/api/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Products', id },
                { type: 'Products', id: 'LIST' },
            ],
        }),

        // Upload image
        uploadImage: builder.mutation<UploadImageResponse, FormData>({
            query: (formData) => ({
                url: '/api/images/upload',
                method: 'POST',
                body: formData,
            }),
        }),

        // Delete image
        deleteImage: builder.mutation<{ message: string }, string>({
            query: (publicId) => ({
                url: `/api/images/${publicId}`,
                method: 'DELETE',
            }),
        }),
        getFilters: builder.query<ProductFiltersModel, void>({
            query: () => '/api/filters',
            providesTags: [{ type: 'Filters', id: 'LIST' }],
        }),

        createFilterOption: builder.mutation<{ message: string; data: FilterBaseModel }, CreateFilterOptionRequest>({
            query: ({ group, code, tr, en }) => ({
                url: `/api/filters/${group}`,
                method: 'POST',
                body: { code, tr, en },
            }),
            invalidatesTags: [{ type: 'Filters', id: 'LIST' }],
        }),

        deleteFilterOption: builder.mutation<{ message: string }, DeleteFilterOptionRequest>({
            query: ({ group, code }) => ({
                url: `/api/filters/${group}/${code}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Filters', id: 'LIST' }],
        }),

    }),
    overrideExisting: false,
});

export const {
    useGetAllProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUploadImageMutation,
    useDeleteImageMutation,
    useGetFiltersQuery,
    useCreateFilterOptionMutation,
    useDeleteFilterOptionMutation,
} = productsApi;