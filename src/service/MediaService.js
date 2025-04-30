import createRequest from "./ApiService";

const defaultUrl = "/medias";

export class MediaService {
  async getAll(params) {
    return createRequest(defaultUrl, "GET", null, params);
  }

  async filter(params) {
    return createRequest(defaultUrl + `/filter`, "GET", null, params);
  }

  async getMediaSources(id) {
    return createRequest(
      defaultUrl + `/${id}/media-sources`,
      "GET",
      null,
      null
    );
  }

  async create(request) {
    return createRequest(defaultUrl, "POST", request, null);
  }

  async update(id, request) {
    return createRequest(defaultUrl + `/${id}`, "PUT", request, null);
  }

  async updateMediaSources(id, request) {
    return createRequest(
      defaultUrl + `/${id}/media-sources`,
      "PUT",
      request,
      null
    );
  }

  async delete(id) {
    return createRequest(defaultUrl + `/${id}`, "DELETE", null, null);
  }
}
