import createRequest from "./ApiService";

const defaultUrl = "api/v1/medias";

export class MediaService {
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

    async getByContentId(params,id) {
        return await createRequest(
            defaultUrl + `/content/${id}`,
            "GET",
            null,
            params,
            this.keycloak
        );
    }

    async getMediaSourcesByMediaId(id) {
        return await createRequest(
            defaultUrl + `/media-sources/${id}`,
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

    async updateMediaSources(id,request) {
        return await createRequest(
            defaultUrl + `/media-sources/${id}`,
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
