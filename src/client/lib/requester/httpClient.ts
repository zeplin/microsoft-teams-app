import Axios from "axios";
import { UNAUTHORIZED } from "http-status-codes";
import { refreshAuthToken } from "./authRequests";
import { storage } from "../storage";
import { AuthToken } from "../../constants";

const httpClient = Axios.create();

httpClient.interceptors.request.use(config => ({
    ...config,
    headers: {
        ...config.headers,
        Authorization: `Bearer ${storage.getAccessToken()}`
    }
}));

let lastResult: Promise<AuthToken> | null = null;
const timoutDuration = 60000; // In ms which equals to 1 minute

// Throttle the request of refresh token to prevent multiple HTTP calls for concurrent requests
function throttledRefreshToken(refreshToken: string): Promise<AuthToken> {
    if (lastResult) {
        return lastResult;
    }
    lastResult = refreshAuthToken(refreshToken);
    setTimeout(
        () => {
            lastResult = null;
        },
        timoutDuration
    );
    return lastResult;
}

httpClient.interceptors.response.use(
    value => value,
    async error => {
        if (error.response.status !== UNAUTHORIZED || error.response.data.detail !== "token_expired") {
            throw error;
        }

        const { accessToken, refreshToken } = await throttledRefreshToken(storage.getRefreshToken());
        storage.setAccessToken(accessToken);
        storage.setRefreshToken(refreshToken);

        return Axios.request({
            ...error.config,
            headers: {
                ...error.config.headers,
                Authorization: `Bearer ${storage.getAccessToken()}`
            }
        });
    }
);

export {
    httpClient
};
