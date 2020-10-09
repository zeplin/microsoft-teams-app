import { httpClient } from "./httpClient";
import { Project, Styleguide, Workspace } from "../../constants";

export const getWorkspaces = (): Promise<Workspace[]> => httpClient.get("/api/workspaces");

export const getProjects = (workspaceId: string, channelId: string): Promise<Project[]> => httpClient.get(
    `/api/workspaces/${workspaceId}/projects?${new URLSearchParams({ channelId }).toString()}`
);

export const getStyleguides = (workspaceId: string, channelId: string): Promise<Styleguide[]> => httpClient.get(
    `/api/workspaces/${workspaceId}/styleguides?${new URLSearchParams({ channelId }).toString()}`
);
