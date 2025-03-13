import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json',
    },
});

const createRequest = async (uri, method , data, params,keycloak) => {
    const config = {
        method,
        url: uri,
        headers: {
            Authorization: `Bearer ${keycloak.token}`,
        },
    };

    if (data) {
        config.data = data;
    }
    if (params) {
        config.params = params;
    }

    try {
        return await api(config);
    } catch (error) {
        if (error.status === 401) {
            keycloak.login();
        }
        console.error(error);
        throw error;
    }
};

export default createRequest;