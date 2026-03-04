import { baseApi } from '../index';

export interface ImageItem {
  id: string;
  publicId: string;
  url: string;
  createdAt?: string;
}

export interface GetImagesResponse {
  images: ImageItem[];
  total: number;
}

export const imagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all images
    getImages: builder.query<GetImagesResponse, void>({
      query: () => '/api/images',
      providesTags: (result) =>
        result
          ? [
            ...result.images.map(({ id }: ImageItem) => ({ type: 'Images' as const, id })),
            { type: 'Images', id: 'LIST' },
          ]
          : [{ type: 'Images', id: 'LIST' }],
    }),

    // Get images filtered by public_id contains
    getImagesByContains: builder.query<GetImagesResponse, string>({
      query: (contains: string) => `/api/images?contains=${encodeURIComponent(contains)}`,
      providesTags: (result) =>
        result
          ? [
            ...result.images.map(({ id }: ImageItem) => ({ type: 'Images' as const, id })),
            { type: 'Images', id: 'LIST' },
          ]
          : [{ type: 'Images', id: 'LIST' }],
    }),

    // Get image by ID
    getImageById: builder.query<ImageItem, string>({
      query: (id: string) => `/api/images/${id}`,
      providesTags: (result, error, id) => [{ type: 'Images', id }],
    }),

    // Upload image
    uploadImage: builder.mutation<{ url: string; publicId: string }, FormData>(
      {query: (formData: FormData) => ({
          url: '/api/images/upload',
          method: 'POST',
          body: formData,
        }),
        invalidatesTags: [{ type: 'Images', id: 'LIST' }],
      }),

    // Delete image
    deleteImage: builder.mutation<{ message: string }, string>({
      query: (id: string) => ({
        url: `/api/images/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Images', id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetImagesQuery, useGetImagesByContainsQuery, useGetImageByIdQuery, useUploadImageMutation, useDeleteImageMutation } = imagesApi;
