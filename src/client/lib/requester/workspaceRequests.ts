import { httpClient } from "./httpClient";
import { Project, Styleguide, Workspace } from "../../constants";

export const getWorkspaces = (): Promise<Workspace[]> => httpClient.get("/api/workspaces");

export const getProjects = (workspace: string): Promise<Project[]> => httpClient.get(
    `/api/workspaces/${workspace}/projects`
);

export const getStyleguides = (workspace: string): Promise<Styleguide[]> => httpClient.get(
    `/api/workspaces/${workspace}/styleguides`
);
