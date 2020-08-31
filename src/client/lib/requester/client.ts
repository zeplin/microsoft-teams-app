import Axios from "axios";
import { UNAUTHORIZED } from "http-status-codes";
import { AuthToken, refreshAuthToken } from "./auth";
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from "../storage";

const client = Axios.create();

client.interceptors.request.use(config => ({
    ...config,
    headers: {
        ...config.headers,
        Authorization: `Bearer ${getAccessToken()}`
    }
}));

let lastResult: Promise<AuthToken> | null = null;
const timoutDuration = 60000;

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

client.interceptors.response.use(
    value => value,
    async error => {
        if (error.response.status !== UNAUTHORIZED || error.response.data.detail !== "token_expired") {
            throw error;
        }

        const { accessToken, refreshToken } = await throttledRefreshToken(getRefreshToken());
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        return Axios.request({
            ...error.config,
            headers: {
                ...error.config.headers,
                Authorization: `Bearer ${getAccessToken()}`
            }
        });
    }
);

export {
    client
};
