import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { baseApi } from "./apis";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "@pages/MainPage";
import AdminPage from "@pages/AdminPage";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ApiProvider api={baseApi}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </ApiProvider>
  </React.StrictMode>
);
