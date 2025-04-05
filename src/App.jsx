import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {keycloak} from "./utils/keycloak/keycloakConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const initOptions = {
    onLoad: "check-sso",
    enableTokenRefresh: true,
    checkLoginIframe: true,
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`
  };

  return (
    <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions}>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route path="admin/*" element={<AdminLayout />} />
        <Route path="rtl/*" element={<RtlLayout />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
      <ToastContainer />
    </ReactKeycloakProvider>
  );
};

export default App;
