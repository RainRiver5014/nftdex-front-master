import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function getRequestWithoutToken(url, params) {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (url.charAt(0) === "/") {
        url = url.slice(1, url.length)
    }
    return axios
        .get(`${BASE_URL}/${url}`, {headers, params})
        .then(response => response)
        .catch((error) => {
            throw error;
        });
}