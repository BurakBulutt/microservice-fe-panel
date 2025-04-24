import axios from "axios";

import { keycloak } from "../utils/keycloak/keycloakConfig";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const createRequest = async (uri, method, data, params) => {
  const token = keycloak.authenticated ? keycloak.token : undefined;

  if (keycloak.didInitialize && !token) {
    keycloak.login({redirectUri: window.location.origin});
  }

  const config = {
    method,
    url: uri,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (data) {
    config.data = data;
  }
  if (params) {
    config.params = params;
  }

  try {
    return await api(config);
  } catch (error) {
    console.error(error);

    if (error.status === 401) {
      keycloak.login({redirectUri: window.location.origin});
    }
    throw error;
  }
};

export default createRequest;
