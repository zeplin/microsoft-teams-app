import { OrganizationRole, OrganizationSummary } from "../../adapters/zeplin/Organizations";
import { zeplin } from "../../adapters/zeplin";

class OrganizationFacade {
    findAll(authToken: string): Promise<OrganizationSummary[]> {
        return zeplin.organizations.list({
            query: {
                roles: [OrganizationRole.OWNER, OrganizationRole.ADMIN, OrganizationRole.EDITOR]
            },
            options: {
                authToken
            }
        });
    }
}

export const organizationFacade = new OrganizationFacade();
