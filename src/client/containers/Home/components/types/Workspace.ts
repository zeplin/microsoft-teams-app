import { WorkspaceType } from "./WorkspaceType";

export type Workspace = {
    type: WorkspaceType.PERSONAL;
} | {
    type: WorkspaceType.ORGANIZATION;
    organizationId: string;
}
