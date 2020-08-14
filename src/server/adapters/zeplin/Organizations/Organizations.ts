import { Requester } from "../requester";

interface OrganizationsFindAllParameter {
    query?: {
        roles?: OrganizationRole[];
    };
    options: {
        authToken: string;
    };
}

export enum OrganizationRole {
    OWNER = "owner",
    ADMIN = "admin",
    EDITOR = "editor",
    MEMBER = "member"
}

export interface OrganizationSummary {
    id: string;
    name: string;
    logo?: string;
}

export class Organizations {
    private readonly requester: Requester;

    constructor(requester: Requester) {
        this.requester = requester;
    }

    findAll({
        query: {
            roles
        } = {},
        options: { authToken }
    }: OrganizationsFindAllParameter): Promise<OrganizationSummary[]> {
        return this.requester.get<OrganizationSummary[]>("/organizations", {
            params: {
                role: roles
            },
            headers: {
                Authorization: authToken
            }
        });
    }
}
