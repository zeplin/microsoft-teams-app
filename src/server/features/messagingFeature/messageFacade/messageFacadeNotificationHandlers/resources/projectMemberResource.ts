import { User, ResourceType } from "../../../messagingTypes";

export type ProjectMemberResource = {
    id: string;
    type: ResourceType.PROJECT_MEMBER;
    data: {
        user: User;
        role: "owner" | "admin" | "user" | "editor" | "member" | "alien";
    };
}