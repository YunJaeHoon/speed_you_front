import axios from 'axios';

const sendApi = async (url, method, authorization, requestData) => {

    let response;

    const headers = authorization ? {
        Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
    } : {
        'Content-Type': 'application/json'
    };

    try {
        if (method === "GET") {
            response = await axios.get(url, {
                headers: headers,
                params: requestData
            });
        }
        else if (method === "POST") {
            response = await axios.post(url, requestData, {
                headers: headers
            });
        }

        return response.data.data;

    }
    catch (error) {
        if (authorization && error.response && error.response.data && error.response.data.code === "UNAUTHORIZED") {
            const accesstoken = await refreshAccessToken();

            if (accesstoken) {
                try {
                    if (method === "GET") {
                        response = await axios.get(url, {
                            headers: headers,
                            params: requestData
                        });
                    }
                    else if (method === "POST") {
                        response = await axios.post(url, requestData, {
                            headers: headers
                        });
                    }

                    return response.data.data;
                }
                catch {
                    throw error;
                }
            }
            else {
                throw error;
            }
        }
        else {
            throw error;
        }
    }
};

const refreshAccessToken = async () => {
    try {
        const response = await axios.get('/api/refresh-token', {
            headers: { Authorization: `Bearer ${window.localStorage.getItem('refreshToken')}` }
        });

        const newAccessToken = response.data.data;

        axios.defaults.headers.common['Authorization'] = newAccessToken;
        window.localStorage.setItem("accessToken", newAccessToken);

        return newAccessToken;
    } catch (error) {
        return null;
    }
};

export { sendApi };
