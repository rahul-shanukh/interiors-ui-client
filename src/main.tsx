import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./app/styles/index.css";
import "swiper/css";
import "swiper/css/pagination";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
