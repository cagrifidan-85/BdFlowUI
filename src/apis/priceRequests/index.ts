import { baseApi } from '@apis/index';
import { PriceRequestPayload } from '@app-types/cart';

interface PriceRequestResponse {
  message: string;
}

export const priceRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendPriceRequest: builder.mutation<PriceRequestResponse, PriceRequestPayload>({
      query: (body) => ({
        url: '/api/price-requests',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSendPriceRequestMutation } = priceRequestApi;
