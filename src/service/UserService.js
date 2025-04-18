import createRequest from "./ApiService";

const defaultUrl = "users";

export class UserService {

  async getAll(params) {
    return await createRequest(
      defaultUrl,
      "GET",
      null,
      params
    );
  }

  async filter(params) {
    return await createRequest(
      defaultUrl + `/filter`,
      "GET",
      null,
      params
    );
  }

  async createUser(request) {
    return await createRequest(
        defaultUrl,
        "POST",
        request,
        null
    );
  }

  async updateUser(id,request) {
    return await createRequest(
        defaultUrl + `/${id}`,
        "PUT",
        request,
        null
    );
  }

  async deleteUser(id) {
    return await createRequest(
        defaultUrl + `/${id}`,
        "DELETE",
        null,
        null
    );
  }

  async verifyEmail(id) {
    return await createRequest(
        defaultUrl + `/${id}/verify-email`,
        "POST",
        null,
        null
    );
  }

  async resetUserPassword(id) {
    return await createRequest(
        defaultUrl + `/${id}/reset-password`,
        "POST",
        null,
        null
    );
  }
}
