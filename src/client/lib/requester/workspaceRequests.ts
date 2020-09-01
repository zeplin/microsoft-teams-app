import { httpClient } from "./httpClient";
import { Project, Styleguide, WorkspaceConstants } from "../../constants";

export const getWorkspaces = async (): Promise<WorkspaceConstants[]> => {
    const { data: result } = await httpClient.get("/api/workspaces");
    return result;
};

export const getProjects = async (workspace: string): Promise<Project[]> => {
    const { data: result } = await httpClient.get(`/api/workspaces/${workspace}/projects`);
    return result;
};

export const getStyleguides = async (workspace: string): Promise<Styleguide[]> => {
    const { data: result } = await httpClient.get(`/api/workspaces/${workspace}/styleguides`);
    return result;
};
