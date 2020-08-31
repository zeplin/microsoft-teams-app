import { client } from "./client";

export interface Workspace {
    id: string;
    name: string;
}

export const fetchWorkspaces = async (): Promise<Workspace[]> => {
    const { data: result } = await client.get("/api/workspaces");
    return result;
};

export interface Project {
    id: string;
    name: string;
}

export const fetchProjects = async (workspace: string): Promise<Project[]> => {
    const { data: result } = await client.get(`/api/workspaces/${workspace}/projects`);
    return result;
};

export interface Styleguide {
    id: string;
    name: string;
}

export const fetchStyleguides = async (workspace: string): Promise<Styleguide[]> => {
    const { data: result } = await client.get(`/api/workspaces/${workspace}/styleguides`);
    return result;
};
