import createRequest from "./ApiService";

const defaultUrl = "/xml";

export class XmlDefinitionService {

  async getAll(params) {
    return await createRequest(defaultUrl, "GET", null, params);
  }

  async startJob(params) {
    return await createRequest(defaultUrl + `/start-job`, "GET", null, params);
  }

  async import(request) {
    return await createRequest(defaultUrl + `/import`, "POST", request, null);
  }

  async delete(id) {
    return await createRequest(defaultUrl + `/${id}`, "DELETE", null, null);
  }
}
