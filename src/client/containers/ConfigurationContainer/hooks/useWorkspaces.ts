import { useQuery } from "react-query";

import { requester } from "../../../lib";
import { Workspace } from "../../../constants";

interface UseWorkspacesResult {
    areWorkspacesLoading: boolean;
    workspaces: Workspace[];
}

interface UseWorkspacesResultParams {
    enabled: boolean;
}

export const useWorkspaces = ({ enabled }: UseWorkspacesResultParams): UseWorkspacesResult => {
    const { isLoading: areWorkspacesLoading, data: workspaces } = useQuery("workspaces", requester.getWorkspaces, { enabled });

    return {
        areWorkspacesLoading,
        workspaces
    };
};
