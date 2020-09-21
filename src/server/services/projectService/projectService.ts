import { zeplin } from "../../adapters";
import { ProjectStatus, WebhookResourceType } from "../../adapters/zeplin/types";
import { configurationRepo } from "../../repos";

interface Project {
    id: string;
    name: string;
}

interface ProjectServiceListParams {
    workspace: string;
    channelId: string;
    authToken: string;
}

interface ProjectServicePaginatedListParams {
    workspace: string;
    authToken: string;
    limit: number;
    offset: number;
}

class ProjectService {
    private listPaginated({
        workspace,
        authToken,
        limit,
        offset
    }: ProjectServicePaginatedListParams): Promise<Project[]> {
        if (workspace === "personal") {
            return zeplin.projects.listMyProjects({
                query: {
                    limit,
                    offset,
                    status: ProjectStatus.ACTIVE
                },
                options: {
                    authToken
                }
            });
        }
        return zeplin.projects.list({
            query: {
                workspace,
                limit,
                offset,
                status: ProjectStatus.ACTIVE
            },
            options: {
                authToken
            }
        });
    }

    async list({
        workspace,
        authToken,
        channelId
    }: ProjectServiceListParams): Promise<Project[]> {
        const projectsMap = new Map<string, Project>();

        const limit = 50;
        let offset = 0;
        let projects = await this.listPaginated({
            workspace,
            limit,
            offset,
            authToken
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
                authToken
            });
        }

        const result = Array.from(projectsMap.values());

        const projectIds = result.map(({ id }) => id);

        const configuredProjectIds = (
            await configurationRepo.listByResourceAndChannel(WebhookResourceType.PROJECT, projectIds, channelId)
        ).map(({ zeplin: { resource: { id } } }) => id);

        return result.filter(({ id }) => !configuredProjectIds.includes(id));
    }
}

export const projectService = new ProjectService();
