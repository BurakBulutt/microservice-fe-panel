import createRequest from "./ApiService";

const defaultUrl = "/xml";

export class XmlDefinitionService {

  async getAll(params) {
    return  createRequest(defaultUrl, "GET", null, params);
  }

  async startJob(params) {
    return  createRequest(defaultUrl + `/start-job`, "GET", null, params);
  }

  async import(request) {
    return  createRequest(defaultUrl + `/import`, "POST", request, null);
  }

  async delete(id) {
    return  createRequest(defaultUrl + `/${id}`, "DELETE", null, null);
  }
}
