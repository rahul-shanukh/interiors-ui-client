import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppQueryProvider } from "./app/providers/query-provider";

import "./app/styles/index.css";
import "swiper/css";
import "swiper/css/pagination";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppQueryProvider>
      <App />
    </AppQueryProvider>
  </React.StrictMode>,
);
