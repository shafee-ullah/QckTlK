import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router";
import { router } from "./router/router.jsx";
import AuthProvider from "./contexts/AuthContext/AuthProvider";
import ThemeProvider from "./contexts/AuthContext/Theme/ThemeProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen font-urbanist ">
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
