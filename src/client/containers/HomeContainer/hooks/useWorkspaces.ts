import { useQuery } from "react-query";
import { fetchWorkspaces, Workspace } from "../../../requester";
import { State, Status } from "./useHomeReducer";

interface UseWorkspacesResult {
    areWorkspacesLoading: boolean;
    workspaces: Workspace[];
}

export const useWorkspaces = (state: State): UseWorkspacesResult => {
    const { isLoading: areWorkspacesLoading, data: workspaces } = useQuery(
        ["workspaces", state.status === Status.CONFIGURATION && state.accessToken],
        (key, accessToken) => fetchWorkspaces(accessToken),
        {
            enabled: !state.configurationId && state.status === Status.CONFIGURATION
        }
    );

    return {
        areWorkspacesLoading,
        workspaces
    };
};
