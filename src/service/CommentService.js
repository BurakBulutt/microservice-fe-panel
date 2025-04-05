import createRequest from "./ApiService";

const defaultUrl = "comments";

export class CommentService {

    async getAll(params) {
        return await createRequest(
            defaultUrl,
            "GET",
            null,
            params
        );
    }

    async create(request) {
        return await createRequest(
            defaultUrl,
            "POST",
            request,
            null
        );
    }

    async update(id,request) {
        return await createRequest(
            defaultUrl + `/${id}`,
            "PATCH",
            request,
            null
        );
    }

    async delete(id) {
        return await createRequest(
            defaultUrl + `/${id}`,
            "DELETE",
            null,
            null
        );
    }
}
