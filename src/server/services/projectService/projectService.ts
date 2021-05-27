import { ProjectStatusEnum } from "@zeplin/sdk";

import { Zeplin } from "../../adapters";
import { configurationRepo } from "../../repos";
import { WebhookResourceTypeEnum } from "../../enums";

interface Project {
    id: string;
    name: string;
}

interface ProjectServiceListParams {
    workspace: string;
    channelId: string;
    accessToken: string;
}

interface ProjectServicePaginatedListParams {
    workspace: string;
    accessToken: string;
    limit: number;
    offset: number;
}

class ProjectService {
    private async listPaginated({
        workspace,
        accessToken,
        limit,
        offset
    }: ProjectServicePaginatedListParams): Promise<Project[]> {
        const zeplin = new Zeplin({ accessToken });
        if (workspace === "personal") {
            const { data } = await zeplin.users.getUserProjects({
                limit,
                offset,
                status: ProjectStatusEnum.ACTIVE
            });
            return data;
        }
        const { data } = await zeplin.projects.getProjects({
            workspace,
            limit,
            offset,
            status: ProjectStatusEnum.ACTIVE
        });
        return data;
    }

    async list({
        workspace,
        accessToken,
        channelId
    }: ProjectServiceListParams): Promise<Project[]> {
        const projectsMap = new Map<string, Project>();

        const limit = 50;
        let offset = 0;
        let projects = await this.listPaginated({
            workspace,
            limit,
            offset,
            accessToken
        });

        while (projects.length > 0) {
            projects.reduce(
                (map, { id, name }) => {
                    map.set(id, { id, name });
                    return map;
                },
                projectsMap
            );

            offset += limit;

            // eslint-disable-next-line no-await-in-loop
            projects = await this.listPaginated({
                workspace,
                limit,
                offset,
                accessToken
            });
        }

        const result = Array.from(projectsMap.values());

        const projectIds = result.map(({ id }) => id);

        const configuredProjectIds = (
            await configurationRepo.listByResourceAndChannel(WebhookResourceTypeEnum.PROJECT, projectIds, channelId)
        ).map(({ zeplin: { resource: { id } } }) => id);

        return result.filter(({ id }) => !configuredProjectIds.includes(id));
    }
}

export const projectService = new ProjectService();
