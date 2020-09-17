import { User } from "../../adapters/zeplin/types";
import { zeplin } from "../../adapters/zeplin";

class MeService {
    get(authToken: string): Promise<User> {
        return zeplin.me.get({ options: { authToken } });
    }
}

export const meService = new MeService();
