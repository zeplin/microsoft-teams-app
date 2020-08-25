import Axios from "axios";

export const fetchAccessToken = async (code: string): Promise<string> => {
    const { data: { accessToken } } = await Axios.post("/api/auth/token", { code });
    return accessToken;
};

