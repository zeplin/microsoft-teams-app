import { User } from "./User";
import { StyleguideMemberRole } from "./StyleguideMemberRole";

export interface StyleguideMember {
    user: User;
    role: StyleguideMemberRole;
}
