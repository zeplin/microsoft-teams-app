import { Requester } from "../requester";
import { OrganizationRole, OrganizationSummary } from "../types";

interface OrganizationsListParameter {
    query?: {
        role?: OrganizationRole[];
    };
    options: {
        authToken: string;
    };
}

export class Organizations {
    private readonly requester: Requester;

    constructor(requester: Requester) {
        this.requester = requester;
    }

    list({
        query,
        options: { authToken }
    }: OrganizationsListParameter): Promise<OrganizationSummary[]> {
        return this.requester.get("/organizations", {
            params: query,
            headers: {
                Authorization: authToken
            }
        });
    }
}
