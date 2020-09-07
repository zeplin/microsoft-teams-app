import { zeplin } from "../../adapters";
import { ProjectStatus } from "../../adapters/zeplin/types";

interface Project {
    id: string;
    name: string;
}

interface ProjectServiceListParams {
    workspace: string;
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
        authToken
    }: ProjectServiceListParams): Promise<Project[]> {
        const result = new Map<string, Project>();

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
                result
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

        return Array.from(result.values());
    }
}

export const projectService = new ProjectService();
