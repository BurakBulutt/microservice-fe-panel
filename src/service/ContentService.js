import createRequest from "./ApiService";

const defaultUrl = "api/v1/contents";

export class ContentService {
    keycloak;

    constructor(keycloak) {
        this.keycloak = keycloak;
    }

    async getAll(params) {
        return await createRequest(
            defaultUrl,
            "GET",
            null,
            params,
            this.keycloak
        );
    }

    async getById(id) {
        return await createRequest(
            defaultUrl + `/${id}`,
            "GET",
            null,
            null,
            this.keycloak
        );
    }

    async create(request) {
        return await createRequest(
            defaultUrl,
            "POST",
            request,
            null,
            this.keycloak
        );
    }

    async update(id,request) {
        return await createRequest(
            defaultUrl + `/${id}`,
            "PUT",
            request,
            null,
            this.keycloak
        );
    }

    async delete(id) {
        return await createRequest(
            defaultUrl + `/${id}`,
            "DELETE",
            null,
            null,
            this.keycloak
        );
    }
}
