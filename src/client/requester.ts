import Axios from "axios";
import { BASE_URL } from "./config";

export interface Workspace {
    id: string;
    name: string;
}

export const getWorkspaces = async (accessToken: string): Promise<Workspace[]> => {
    const { data: result } = await Axios.get(
        `${BASE_URL}/api/workspaces`,
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

