import { useQuery } from "react-query";
import { fetchWorkspaces, Workspace } from "../../../requester";
import { State, Status } from "./useHomeReducer";
import { useRouter } from "next/router";

interface UseWorkspacesResult {
    areWorkspacesLoading: boolean;
    workspaces: Workspace[];
}

export const useWorkspaces = (state: State): UseWorkspacesResult => {
    const { query: { id } } = useRouter();

    const { isLoading: areWorkspacesLoading, data: workspaces } = useQuery(
        ["workspaces", state.status === Status.CONFIGURATION && state.accessToken],
        (key, accessToken) => fetchWorkspaces(accessToken),
        {
            enabled: !id && state.status === Status.CONFIGURATION
        }
    );

    return {
        areWorkspacesLoading,
        workspaces
    };
};
