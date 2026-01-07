
import {  QUERY_METHOD, TODOS } from '../../constants/api'



import { baseApi } from '..'


const api = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getTodos: builder.query<any, void>({
      query: () => ({
        url: TODOS,
        method: QUERY_METHOD,
      }),
      extraOptions: { handleDialogBox: true },
    }),
  }),
})

export const { useGetTodosQuery } = api
