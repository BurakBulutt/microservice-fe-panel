import createRequest from "./ApiService";

const defaultUrl = "/contents";

export class ContentService {
  async getAll(params) {
    return createRequest(defaultUrl, "GET", null, params);
  }

  async filter(params) {
    return createRequest(defaultUrl + `/filter`, "GET", null, params);
  }

  async getById(id) {
    return createRequest(defaultUrl + `/${id}`, "GET", null, null);
  }

  async create(request) {
    return createRequest(defaultUrl, "POST", request, null);
  }

  async update(id, request) {
    return createRequest(defaultUrl + `/${id}`, "PUT", request, null);
  }

  async delete(id) {
    return createRequest(defaultUrl + `/${id}`, "DELETE", null, null);
  }
}
