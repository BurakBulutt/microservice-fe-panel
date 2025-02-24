import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {keycloakConfig} from "./utils/keycloak/keycloakconfig";

const App = () => {
  const initOptions = {
    onLoad: "login-required",
    pkceMethod: "S256",
    checkLoginIframe: false,
    silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
  };

  return (
    <ReactKeycloakProvider authClient={keycloakConfig} initOptions={initOptions}>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route path="admin/*" element={<AdminLayout />} />
        <Route path="rtl/*" element={<RtlLayout />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ReactKeycloakProvider>
  );
};

export default App;
