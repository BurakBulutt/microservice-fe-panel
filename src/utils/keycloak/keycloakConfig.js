import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
    url: process.env.REACT_APP_KEYCLOAK_BASE_URL,
    realm: 'dev',
    clientId: 'app-admin-client',
    flow: 'standard',
    pkceMethod: "S256",
});