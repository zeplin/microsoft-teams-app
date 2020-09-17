import { Requester } from "../requester";
import { User } from "../types";

interface GetMeParameter {
    options: {
        authToken: string;
    };
}
export class Me {
    private readonly requester: Requester;

    constructor(requester: Requester) {
        this.requester = requester;
    }

    get({
        options: {
            authToken
        }
    }: GetMeParameter): Promise<User> {
        return this.requester.get("/users/me", {
            headers: {
                Authorization: authToken
            }
        });
    }
}
