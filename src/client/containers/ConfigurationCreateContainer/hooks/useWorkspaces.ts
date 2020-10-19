import { useQuery } from "react-query";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status-codes";

import { requester } from "../../../lib";
import { Workspace } from "../../../constants";
import { ClientError } from "../../../ClientError";

const RETRY_COUNT = 3;

interface UseWorkspacesResult {
    areWorkspacesLoading: boolean;
    workspacesError: boolean;
    workspaces?: Workspace[];
    refetchWorkspaces: () => void;
}

interface UseWorkspacesResultParams {
    onError: (isAuthorizationError: boolean) => void;
}

export const useWorkspaces = ({
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
            retry: (failureCount, error: Error) => (
                (!(error instanceof ClientError) || error.status >= INTERNAL_SERVER_ERROR) &&
                failureCount <= RETRY_COUNT
            ),
            onError: error => onError(error instanceof ClientError && error.status === UNAUTHORIZED)
        }
    );

    return {
        areWorkspacesLoading,
        workspacesError,
        workspaces,
        refetchWorkspaces
    };
};
