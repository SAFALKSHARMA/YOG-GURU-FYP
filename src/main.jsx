import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import Aos from "aos";
import AppRouter from "./routes/AppRouter";
import { AppContextProvider } from "./context/AppContext";
import { Provider } from "react-redux";
import store from "./redux/store.js";

const queryClient = new QueryClient();

Aos.init();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <AppRouter />
      </AppContextProvider>
    </QueryClientProvider>
  </Provider>
);
