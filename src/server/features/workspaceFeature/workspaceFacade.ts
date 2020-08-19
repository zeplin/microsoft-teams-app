import { OrganizationRole } from "../../adapters/zeplin/Organizations";
import { zeplin } from "../../adapters/zeplin";

interface Workspace {
    id: string;
    name: string;
}

class WorkspaceFacade {
    async list(authToken: string): Promise<Workspace[]> {
        const organizations = await zeplin.organizations.list({
            query: {
                roles: [OrganizationRole.OWNER, OrganizationRole.ADMIN, OrganizationRole.EDITOR]
            },
            options: {
                authToken
            }
        });
        return [
            { id: "personal", name: "Personal Workspace" },
            ...organizations.map(({ id, name }) => ({ id, name: `${name}'s Workspace` }))
        ];
    }
}

export const workspaceFacade = new WorkspaceFacade();
