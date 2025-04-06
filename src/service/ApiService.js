import axios from "axios";

import { keycloak } from "../utils/keycloak/keycloakConfig";

const api = axios.create({
  baseURL: "http://localhost:8080/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

const createRequest = async (uri, method, data, params) => {
  const token = keycloak.authenticated ? keycloak.token : undefined;

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
