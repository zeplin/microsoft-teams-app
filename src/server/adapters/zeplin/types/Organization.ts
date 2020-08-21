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
