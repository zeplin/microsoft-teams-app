import { User, ResourceType } from "../../../messagingTypes";

export type StyleguideMemberResource = {
    id: string;
    type: ResourceType.STYLEGUIDE_MEMBER;
    data: {
        user: User;
        role: "owner" | "admin" | "user" | "editor" | "member" | "alien";
    };
}