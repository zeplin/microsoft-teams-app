import { httpClient } from "./httpClient";
import { User } from "../../constants";

export const getMe = async (): Promise<User> => {
    const { data: result } = await httpClient.get("/api/me");
    return result;
};
