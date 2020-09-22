import { useQuery } from "react-query";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status-codes";
import * as microsoftTeams from "@microsoft/teams-js";

import { requester } from "../../../lib";
import { Project, Styleguide } from "../../../constants";
import { ClientError } from "../../../ClientError";

const RETRY_COUNT = 3;

interface UseResourcesResult {
    areResourcesLoading: boolean;
    projectsError: boolean;
    styleguidesError: boolean;
    projects?: Project[];
    styleguides?: Styleguide[];
    refetchProjects: () => void;
    refetchStyleguides: () => void;
}

interface UseWorkspacesResultParams {
    enabled: boolean;
    workspace?: string;
    onError: (isAuthorizationError: boolean) => void;
}

const getChannelId = (): Promise<string> => new Promise(resolve => {
    microsoftTeams.getContext(({ channelId }) => resolve(channelId as string));
});

export const useResources = ({ enabled, workspace, onError }: UseWorkspacesResultParams): UseResourcesResult => {
    const {
        isLoading: areProjectsLoading,
        data: projects,
        isError: projectsError,
        refetch: refetchProjects
    } = useQuery(
        ["projects", workspace],
        async () => requester.getProjects(workspace ?? "", await getChannelId()),
        {
            enabled,
            retry: (failureCount, error: Error) => (
                (!(error instanceof ClientError) || error.status >= INTERNAL_SERVER_ERROR) &&
                failureCount <= RETRY_COUNT
            ),
            onError: error => onError(error instanceof ClientError && error.status === UNAUTHORIZED)
        }
    );

    const {
        isLoading: areStyleguidesLoading,
        data: styleguides,
        isError: styleguidesError,
        refetch: refetchStyleguides
    } = useQuery(
        ["styleguides", workspace],
        async () => requester.getStyleguides(workspace ?? "", await getChannelId()),
        {
            enabled,
            retry: (failureCount, error: Error) => (
                (!(error instanceof ClientError) || error.status >= INTERNAL_SERVER_ERROR) &&
                failureCount <= RETRY_COUNT
            ),
            onError: error => onError(error instanceof ClientError && error.status === UNAUTHORIZED)
        }
    );

    return {
        areResourcesLoading: areProjectsLoading || areStyleguidesLoading,
        projectsError,
        styleguidesError,
        styleguides,
        projects,
        refetchProjects,
        refetchStyleguides
    };
};
