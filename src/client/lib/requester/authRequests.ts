import { AuthToken } from "../../constants";
import { httpClient } from "./httpClient";

export const createAuthToken = (code: string): Promise<AuthToken> => httpClient.post(
    "/api/auth/token",
    { code },
    { useAuth: false }
);

export const refreshAuthToken = (refreshToken: string): Promise<AuthToken> => httpClient.post(
    "/api/auth/token",
    { refreshToken },
    { useAuth: false }
);

