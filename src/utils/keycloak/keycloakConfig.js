import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
    url: 'http://localhost:8090',
    realm: 'dev',
    clientId: 'app-admin-client',
    flow: 'standard',
    pkceMethod: "S256",
});