import { BAD_REQUEST, OK, UNAUTHORIZED } from "http-status-codes";
import { refreshAuthToken } from "./authRequests";
import { storage } from "../storage";
import { AuthToken } from "../../constants";
import { ClientError } from "../../ClientError";

let lastResult: Promise<AuthToken> | null = null;
const timeoutDuration = 60000; // In ms which equals to 1 minute

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
        timeoutDuration
    );
    return lastResult;
}

interface RequestConfig {
    useAuth?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getData(response: Response): Promise<any> {
    try {
        return await response.json();
    } catch (errorJson) {
        try {
            return await response.text();
        } catch (errorText) {
            return null;
        }
    }
}

class HttpClient {
    private async fetch<T>(url: string, init: RequestInit): Promise<T> {
        const response = await fetch(url, init);
        const data = await getData(response);
        if (response.status >= OK && response.status < BAD_REQUEST) {
            return data;
        }
        throw new ClientError(
            data?.detail ?? "Unexpected Error",
            data?.title ?? "Unexpected Error",
            response.status
        );
    }
    private async fetchWithAuth<T>(url: string, init: RequestInit): Promise<T> {
        try {
            return await this.fetch<T>(
                url,
                {
                    ...init,
                    headers: {
                        ...init.headers,
                        Authorization: `Bearer ${storage.getAccessToken()}`
                    }
                }
            );
        } catch (error) {
            if (!(error instanceof ClientError) || error.status !== UNAUTHORIZED) {
                throw error;
            }
            const currentRefreshToken = storage.getRefreshToken();

            if (error.message !== "token_expired" || !currentRefreshToken) {
                storage.removeAccessToken();
                storage.removeRefreshToken();
                throw error;
            }

            try {
                const { accessToken, refreshToken } = await throttledRefreshToken(currentRefreshToken);
                storage.setAccessToken(accessToken);
                storage.setRefreshToken(refreshToken);
            } catch (refreshTokenError) {
                storage.removeAccessToken();
                storage.removeRefreshToken();
                throw error;
            }

            try {
                return await this.fetch<T>(
                    url,
                    {
                        ...init,
                        headers: {
                            ...init.headers,
                            Authorization: `Bearer ${storage.getAccessToken()}`
                        }
                    }
                );
            } catch (secondError) {
                if (secondError instanceof ClientError && secondError.status === UNAUTHORIZED) {
                    storage.removeAccessToken();
                    storage.removeRefreshToken();
                }
                throw secondError;
            }
        }
    }

    private request<T>(url: string, init: RequestInit, { useAuth = true }: RequestConfig = {}): Promise<T> {
        if (useAuth) {
            return this.fetchWithAuth(url, init);
        }
        return this.fetch(url, init);
    }

    get<T>(url: string, config?: RequestConfig): Promise<T> {
        return this.request(url, { method: "GET" }, config);
    }

    post<T>(url: string, data: object, config?: RequestConfig): Promise<T> {
        return this.request(
            url,
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" }
            },
            config
        );
    }

    put<T>(url: string, data: object, config?: RequestConfig): Promise<T> {
        return this.request(
            url,
            {
                method: "PUT",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" }
            },
            config
        );
    }

    async delete(url: string, config?: RequestConfig): Promise<void> {
        await this.request(url, { method: "DELETE" }, config);
    }
}

export const httpClient = new HttpClient();
