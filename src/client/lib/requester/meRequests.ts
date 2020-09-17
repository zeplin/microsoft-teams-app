import { httpClient } from "./httpClient";
import { User } from "../../constants";

export const getMe = (): Promise<User> => httpClient.get("/api/me");
