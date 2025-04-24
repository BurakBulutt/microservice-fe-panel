import createRequest from "./ApiService";

const defaultUrl = "/contents";

export class ContentService {
  async getAll(params) {
    return await createRequest(defaultUrl, "GET", null, params);
  }

  async filter(params) {
    return await createRequest(defaultUrl + `/filter`, "GET", null, params);
  }

  async getById(id) {
    return await createRequest(defaultUrl + `/${id}`, "GET", null, null);
  }

  async create(request) {
    return await createRequest(defaultUrl, "POST", request, null);
  }

  async update(id, request) {
    return await createRequest(defaultUrl + `/${id}`, "PUT", request, null);
  }

  async delete(id) {
    return await createRequest(defaultUrl + `/${id}`, "DELETE", null, null);
  }
}
