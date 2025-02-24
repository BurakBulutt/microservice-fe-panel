import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json',
    },
});

const createRequest = async (uri, method , data, params,token) => {
    const config = {
        method,
        url: uri,
        headers: {
            Authorization: `Bearer ${token}`,
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
        if (error.status !== 503) {
            throw error;
        }
        console.error(error);
    }
};

export default createRequest;