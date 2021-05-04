import { Zeplin } from "../../adapters";

interface Workspace {
    id: string;
    name: string;
}

class WorkspaceService {
    async list(accessToken: string): Promise<Workspace[]> {
        const zeplin = new Zeplin({ accessToken });
        const { data } = await zeplin.organizations.getOrganizations({
            role: ["owner", "admin", "editor"]
        });
        return [
            { id: "personal", name: "Personal Workspace" },
            ...data.map(({ id, name }) => ({ id, name: `${name}'s Workspace` }))
        ];
    }
}

export const workspaceService = new WorkspaceService();
