import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
 baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL || "http://localhost:5000" }),
 tagTypes: ['Products', 'Images', 'SiteSettings'],
 endpoints: () => ({}),
});

