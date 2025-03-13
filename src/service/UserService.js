import createRequest from "./ApiService";

const defaultUrl = "api/v1/users";

export class UserService {
  keycloak;

  constructor(keycloak) {
    this.keycloak = keycloak;
  }

  async getAllUsers(params) {
    return await createRequest(
      defaultUrl,
      "GET",
      null,
      params,
      this.keycloak
    );
  }

  async createUser(request) {
    return await createRequest(
        defaultUrl,
        "POST",
        request,
        null,
        this.keycloak
    );
  }

  async updateUser(id,request) {
    return await createRequest(
        defaultUrl + `/${id}`,
        "PUT",
        request,
        null,
        this.keycloak
    );
  }

  async deleteUser(id) {
    return await createRequest(
        defaultUrl + `/${id}`,
        "DELETE",
        null,
        null,
        this.keycloak
    );
  }

  async verifyEmail(id) {
    return await createRequest(
        defaultUrl + `/${id}/verify-email`,
        "POST",
        null,
        null,
        this.keycloak
    );
  }

  async resetUserPassword(id) {
    return await createRequest(
        defaultUrl + `/${id}/reset-password`,
        "POST",
        null,
        null,
        this.keycloak
    );
  }

  async usersCount() {
    return await createRequest(
        defaultUrl + "/count",
        "GET",
        null,
        null,
        this.keycloak
    );
  }
}
