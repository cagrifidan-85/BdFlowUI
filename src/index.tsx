import React from "react";
import ReactDOM from "react-dom/client";
import Main from "./components/main";
import "./i18n";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { baseApi } from "./apis";



const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// if (process.env.NODE_ENV === "development") {
  const { worker } = require("./mocks/browser");
  worker.start();
// }

root.render(
  <React.StrictMode>
     <ApiProvider api={baseApi}>
    <Main />
    </ApiProvider>
  </React.StrictMode>
);
