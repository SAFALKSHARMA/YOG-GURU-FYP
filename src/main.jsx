import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import Aos from "aos";
import { router } from "./routes/router";
import { AppContextProvider } from "./context/AppContext"; // Import AppContextProvider

const queryClient = new QueryClient();

Aos.init();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  </QueryClientProvider>
);
