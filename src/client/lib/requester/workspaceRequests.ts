import { httpClient } from "./httpClient";
import { Project, Styleguide, Workspace } from "../../constants";

export const getWorkspaces = (): Promise<Workspace[]> => httpClient.get("/api/workspaces");

export const getProjects = (workspace: string, channelId: string): Promise<Project[]> => httpClient.get(
    `/api/workspaces/${workspace}/projects?${new URLSearchParams({ channelId }).toString()}`
);

export const getStyleguides = (workspace: string, channelId: string): Promise<Styleguide[]> => httpClient.get(
    `/api/workspaces/${workspace}/styleguides?${new URLSearchParams({ channelId }).toString()}`
);
