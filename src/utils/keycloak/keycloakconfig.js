import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: 'http://localhost:8180',
    realm: 'lotheas',
    clientId: 'app-public-client',
    flow: 'standard'
})

export const keycloakConfig = keycloak;