import Axios from "axios";
import { AuthToken } from "../../constants";

export const getAuthToken = async (code: string): Promise<AuthToken> => {
    const { data } = await Axios.post("/api/auth/token", { code });
    return data;
};

export const refreshAuthToken = async (refreshToken: string): Promise<AuthToken> => {
    const { data } = await Axios.post("/api/auth/token", { refreshToken });
    return data;
};

