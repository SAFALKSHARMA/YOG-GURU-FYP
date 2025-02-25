import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import Aos from "aos";
import AppRouter from "./routes/AppRouter";
import { AppContextProvider } from "./context/AppContext";

const queryClient = new QueryClient();

Aos.init();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AppContextProvider>
      <AppRouter />
    </AppContextProvider>
  </QueryClientProvider>
);
