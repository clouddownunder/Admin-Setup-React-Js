/* eslint-disable */

import axios from "axios";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { RecoilRoot } from "recoil";

import "bootstrap/dist/css/bootstrap.min.css";
import "./theme/root-style.css";
import "./theme/custom.css";
import "./theme/responsive.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ThemeProvider from "src/theme";

import App from "./app";
// ======================================================
// APP VERSION CACHE RESET
// ======================================================

const APP_VERSION = "1.0.1";

// ======================================================
// CLEAR ALL COOKIES
// ======================================================

const clearCookies = () => {
  try {
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=${window.location.hostname};`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.${window.location.hostname};`;
    });

    console.log("🍪 Cookies cleared");
  } catch (error) {
    console.error("Cookie clear failed:", error);
  }
};

// ======================================================
// CLEAR APPLICATION STORAGE
// ======================================================

const clearApplicationData = () => {
  try {
    localStorage.clear();
    sessionStorage.clear();

    clearCookies();

    console.log("🧹 Application storage cleared");
  } catch (error) {
    console.error("Storage clear failed:", error);
  }
};

// ======================================================
// VERSION CHECK
// ======================================================

try {
  const storedVersion = localStorage.getItem("app_version");

  if (storedVersion !== APP_VERSION) {
    console.log("🧹 New app version detected");

    clearApplicationData();

    localStorage.setItem("app_version", APP_VERSION);

    // Force fresh app load
    window.location.reload();
  }
} catch (error) {
  console.error("Version check failed:", error);
}

// ======================================================
// LOGOUT HANDLER
// ======================================================

const handleLogout = () => {
  try {
    console.log("🔴 Logging out user");

    clearApplicationData();

    window.location.replace("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// ======================================================
// AXIOS RESPONSE INTERCEPTOR
// ======================================================

axios.interceptors.response.use(
  (response) => {
    const status = response?.data?.status;

    // Your backend token expired status
    if (status === 4) {
      console.log("🔴 TOKEN EXPIRED");

      handleLogout();
    }

    return response;
  },
  (error) => {
    const backendStatus = error?.response?.data?.status;
    const httpStatus = error?.response?.status;

    if (backendStatus === 4 || httpStatus === 401) {
      console.log("🔴 TOKEN EXPIRED (ERROR)");

      handleLogout();
    }

    return Promise.reject(error);
  },
);

// ======================================================
// CHUNK LOAD / CACHE FAILURE RECOVERY
// ======================================================

window.addEventListener("error", (event) => {
  const message = event?.message || "";

  const isChunkError =
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Loading chunk") ||
    message.includes("ChunkLoadError");

  if (isChunkError) {
    console.log("🔄 Chunk loading failed");

    clearApplicationData();

    window.location.reload();
  }
});

// ======================================================
// OPTIONAL SERVICE WORKER CLEANUP
// Uncomment if facing aggressive cache issues
// ======================================================

/*
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
  });
}
*/

// ======================================================
// ROOT RENDER
// ======================================================

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <RecoilRoot>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </RecoilRoot>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>,
);
