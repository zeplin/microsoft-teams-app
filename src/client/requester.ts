import Axios from "axios";

export const getAccessToken = async (code: string): Promise<string> => {
    const { data: { accessToken } } = await Axios.post("/api/auth/token", { code });
    return accessToken;
};

export interface Workspace {
    id: string;
    name: string;
}

export const getWorkspaces = async (accessToken: string): Promise<Workspace[]> => {
    const { data: result } = await Axios.get(
        "/api/workspaces",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
    return result;
};

export interface Project {
    id: string;
    name: string;
}

export const getProjects = async (workspaceId: string, accessToken: string): Promise<Project[]> => {
    const { data: result } = await Axios.get(
        `/api/workspaces/${workspaceId}/projects`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
    return result;
};

export interface Styleguide {
    id: string;
    name: string;
}

export const getStyleguides = async (workspaceId: string, accessToken: string): Promise<Styleguide[]> => {
    const { data: result } = await Axios.get(
        `/api/workspaces/${workspaceId}/styleguides`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
    return result;
};

// TODO: use following types for other POST/PATCH configurations

export enum ResourceType {
    PROJECT,
    STYLEGUIDE
}

export interface Resource {
    type: ResourceType;
    id: string;
}

