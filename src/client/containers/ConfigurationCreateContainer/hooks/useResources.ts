import { useQuery } from "react-query";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status-codes";
import { app } from "@microsoft/teams-js";

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
    workspaceId?: string;
    onError: (isAuthorizationError: boolean) => void;
    onProjectsSuccess: (projects: Project[]) => void;
    onStyleguidesSuccess: (styleguides: Styleguide[]) => void;
}

const getChannelId = (): Promise<string> => new Promise((resolve, reject) => {
    app.getContext().then(({ channel }) => {
        if (channel) {
            resolve(channel.id);
        }
        reject(new Error("Channel is not defined"));
    });
});

export const useResources = ({
    workspaceId,
    onError,
    onProjectsSuccess,
    onStyleguidesSuccess
}: UseWorkspacesResultParams): UseResourcesResult => {
    const {
        isLoading: areProjectsLoading,
        data: projects,
        isError: projectsError,
        refetch: refetchProjects
    } = useQuery(
        ["projects", workspaceId],
        async () => requester.getProjects(workspaceId ?? "", await getChannelId()),
        {
            enabled: workspaceId,
            retry: (failureCount, error: Error) => (
                (!(error instanceof ClientError) || error.status >= INTERNAL_SERVER_ERROR) &&
                failureCount <= RETRY_COUNT
            ),
            onSuccess: onProjectsSuccess,
            onError: error => onError(error instanceof ClientError && error.status === UNAUTHORIZED)
        }
    );

    const {
        isLoading: areStyleguidesLoading,
        data: styleguides,
        isError: styleguidesError,
        refetch: refetchStyleguides
    } = useQuery(
        ["styleguides", workspaceId],
        async () => requester.getStyleguides(workspaceId ?? "", await getChannelId()),
        {
            enabled: workspaceId,
            retry: (failureCount, error: Error) => (
                (!(error instanceof ClientError) || error.status >= INTERNAL_SERVER_ERROR) &&
                failureCount <= RETRY_COUNT
            ),
            onSuccess: onStyleguidesSuccess,
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
