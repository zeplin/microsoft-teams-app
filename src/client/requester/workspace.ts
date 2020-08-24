import Axios from "axios";

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

export const getProjects = async (workspace: string, accessToken: string): Promise<Project[]> => {
    const { data: result } = await Axios.get(
        `/api/workspaces/${workspace}/projects`,
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

export const getStyleguides = async (workspace: string, accessToken: string): Promise<Styleguide[]> => {
    const { data: result } = await Axios.get(
        `/api/workspaces/${workspace}/styleguides`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
    return result;
};
