import { User } from "./User";
import { ProjectMemberRole } from "./ProjectMemberRole";

export interface ProjectMember {
    user: User;
    role: ProjectMemberRole;
}
