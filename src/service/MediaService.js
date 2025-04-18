import createRequest from "./ApiService";

const defaultUrl = "medias";

export class MediaService {
  async getAll(params) {
    return await createRequest(defaultUrl, "GET", null, params);
  }

  async filter(params) {
    return await createRequest(defaultUrl + `/filter`, "GET", null, params);
  }

  async getMediaSources(id) {
    return await createRequest(
      defaultUrl + `/media-sources/${id}`,
      "GET",
      null,
      null
    );
  }

  async create(request) {
    return await createRequest(defaultUrl, "POST", request, null);
  }

  async update(id, request) {
    return await createRequest(defaultUrl + `/${id}`, "PUT", request, null);
  }

  async updateMediaSources(id, request) {
    return await createRequest(
      defaultUrl + `/media-sources/${id}`,
      "PUT",
      request,
      null
    );
  }

  async delete(id) {
    return await createRequest(defaultUrl + `/${id}`, "DELETE", null, null);
  }
}
