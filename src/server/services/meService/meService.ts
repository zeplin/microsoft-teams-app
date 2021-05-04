import { User } from "@zeplin/sdk";

import { Zeplin } from "../../adapters/zeplin";

class MeService {
    async get(accessToken: string): Promise<User> {
        const zeplin = new Zeplin({ accessToken });
        const { data } = await zeplin.users.getCurrentUser();
        return data;
    }
}

export const meService = new MeService();
