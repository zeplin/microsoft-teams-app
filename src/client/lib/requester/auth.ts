import Axios from "axios";

export interface AuthToken {
    accessToken: string;
    refreshToken: string;
}

export const fetchAuthToken = async (code: string): Promise<AuthToken> => {
    const { data } = await Axios.post("/api/auth/token", { code });
    return data;
};

export const refreshAuthToken = async (refreshToken: string): Promise<AuthToken> => {
    const { data } = await Axios.post("/api/auth/token", { refreshToken });
    return data;
};

