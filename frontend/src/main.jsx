import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import App from "./App";
import { Provider } from "./components/ui/provider";
import UserContextProvider from "./provider/ChatProvider";

// Define the routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomePage />} /> {/* Default nested route */}
      <Route path="chats" element={<ChatPage />} />
    </Route>
  )
);

// Move UserContextProvider inside RouterProvider
ReactDOM.createRoot(document.getElementById("root")).render(

    <Provider>
      <RouterProvider router={router}>
        <UserContextProvider>
          {/* UserContextProvider needs RouterProvider to work properly */}
        </UserContextProvider>
      </RouterProvider>
    </Provider>
);
