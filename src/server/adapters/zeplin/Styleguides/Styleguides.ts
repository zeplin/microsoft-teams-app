import { Requester } from "../requester";
import { Styleguide, StyleguideStatus } from "../types";

interface StyleguidesListParameter {
    query?: {
        limit?: number;
        offset?: number;
        workspace?: string;
        status?: StyleguideStatus.ACTIVE | StyleguideStatus.ARCHIVED;
        linked_project?: string;
    };
    options: {
        authToken: string;
    };
}

interface MyStyleguidesListParameter {
    query?: {
        limit?: number;
        offset?: number;
        status?: StyleguideStatus.ACTIVE | StyleguideStatus.ARCHIVED;
    };
    options: {
        authToken: string;
    };
}

export class Styleguides {
    private readonly requester: Requester;

    constructor(requester: Requester) {
        this.requester = requester;
    }

    list(
        {
            query,
            options: { authToken }
        }: StyleguidesListParameter
    ): Promise<Styleguide[]> {
        return this.requester.get(
            "/styleguides",
            {
                params: query,
                headers: {
                    Authorization: authToken
                }
            }
        );
    }

    listMyStyleguides(
        {
            query,
            options: { authToken }
        }: MyStyleguidesListParameter
    ): Promise<Styleguide[]> {
        return this.requester.get(
            "/users/me/styleguides",
            {
                params: query,
                headers: {
                    Authorization: authToken
                }
            }
        );
    }
}
