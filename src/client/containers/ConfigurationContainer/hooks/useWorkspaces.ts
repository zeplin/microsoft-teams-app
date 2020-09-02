import { useQuery } from "react-query";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status-codes";
import { AxiosError } from "axios";

import { requester } from "../../../lib";
import { Workspace } from "../../../constants";

const retryCount = 3;

interface UseWorkspacesResult {
    areWorkspacesLoading: boolean;
    workspacesError: boolean;
    workspaces: Workspace[];
    refetchWorkspaces: () => void;
}

interface UseWorkspacesResultParams {
    enabled: boolean;
    onError: (isAuthorizationError: boolean) => void;
}

export const useWorkspaces = ({
    enabled,
    onError
}: UseWorkspacesResultParams): UseWorkspacesResult => {
    const {
        isLoading: areWorkspacesLoading,
        data: workspaces,
        isError: workspacesError,
        refetch: refetchWorkspaces
    } = useQuery(
        "workspaces",
        requester.getWorkspaces,
        {
            retry: (failureCount, error: AxiosError) => (
                error.response?.status >= INTERNAL_SERVER_ERROR &&
                failureCount <= retryCount
            ),
            onError: error => onError(error.response?.status === UNAUTHORIZED),
            enabled
        }
    );

    return {
        areWorkspacesLoading,
        workspacesError,
        workspaces,
        refetchWorkspaces
    };
};
