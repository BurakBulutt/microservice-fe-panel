import createRequest from "./ApiService";

const defaultUrl = "/comments";

export class CommentService {
  async getAll(params) {
    return createRequest(defaultUrl, "GET", null, params);
  }

  async filter(params) {
    return createRequest(defaultUrl + `/filter`, "GET", null, params);
  }

  async create(request) {
    return createRequest(defaultUrl, "POST", request, null);
  }

  async update(id, request) {
    return createRequest(defaultUrl + `/${id}`, "PATCH", request, null);
  }

  async delete(id) {
    return createRequest(defaultUrl + `/${id}`, "DELETE", null, null);
  }
}
