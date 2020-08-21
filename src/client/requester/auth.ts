import Axios from "axios";

export const getAccessToken = async (code: string): Promise<string> => {
    const { data: { accessToken } } = await Axios.post("/api/auth/token", { code });
    return accessToken;
};

