import { Requester } from "../requester";
import { Project, ProjectStatus } from "../types";

interface ProjectsListParameter {
    query?: {
        limit?: number;
        offset?: number;
        workspace?: string;
        status?: ProjectStatus.ACTIVE | ProjectStatus.ARCHIVED;
    };
    options: {
        authToken: string;
    };
}

interface MyProjectsListParameter {
    query?: {
        limit?: number;
        offset?: number;
        status?: ProjectStatus.ACTIVE | ProjectStatus.ARCHIVED;
    };
    options: {
        authToken: string;
    };
}

export class Projects {
    private readonly requester: Requester;

    constructor(requester: Requester) {
        this.requester = requester;
    }

    list(
        {
            query,
            options: { authToken }
        }: ProjectsListParameter
    ): Promise<Project[]> {
        return this.requester.get(
            "/projects",
            {
                params: query,
                headers: {
                    Authorization: authToken
                }
            }
        );
    }

    listMyProjects(
        {
            query,
            options: { authToken }
        }: MyProjectsListParameter
    ): Promise<Project[]> {
        return this.requester.get(
            "/users/me/projects",
            {
                params: query,
                headers: {
                    Authorization: authToken
                }
            }
        );
    }
}
