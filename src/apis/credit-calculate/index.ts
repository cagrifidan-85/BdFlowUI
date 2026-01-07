
import { CREDIT_CALCULATE, POST_METHOD } from '../../constants/api'
import { getApiURL } from '../../utils/api'

import { CreditCalculateRequest, CreditCalculateResponse } from './type'
import { baseApi } from '..'


const api = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    postCommercialLoanCalculate: builder.query<CreditCalculateResponse, CreditCalculateRequest>({
      query: (req) => ({
        url: getApiURL(CREDIT_CALCULATE),
        method: POST_METHOD,
        body: req,
      }),
      extraOptions: { handleDialogBox: true },
    }),
  }),
})

export const { usePostCommercialLoanCalculateQuery } = api
