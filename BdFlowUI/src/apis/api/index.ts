import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "..";
// Veya from '@reduxjs/toolkit/query/react'


// Store'u yapılandır
export const store = configureStore({
 reducer: {
  // Üretilen reducer'ı özel bir ana düzey kesite (slice) olarak ekleyin
  [baseApi.reducerPath]: baseApi.reducer,
 },
 // api middleware'i eklemek, önbellekleme, geçersiz kılma, anketleme ve
 // `rtk-query`'nin diğer faydalı özelliklerini etkinleştirir.
 middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(baseApi.middleware),
});