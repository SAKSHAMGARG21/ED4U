import axios from "axios"

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    let realheaders = {
        Authorization: `Bearer ${headers}`,
    }
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: realheaders ? realheaders : null,
        params: params ? params : null,
    });
}