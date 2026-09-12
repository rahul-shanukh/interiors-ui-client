import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./app/styles/index.css";
import "swiper/css";
import "swiper/css/pagination";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Prevent the browser from automatically trying to restore legacy scroll positions
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
