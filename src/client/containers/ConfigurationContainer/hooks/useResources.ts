import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status-codes";

import { requester } from "../../../lib";
import { Project, Styleguide } from "../../../constants";

const RETRY_COUNT = 3;

interface UseResourcesResult {
    areResourcesLoading: boolean;
    projectsError: boolean;
    styleguidesError: boolean;
    projects: Project[];
    styleguides: Styleguide[];
    refetchProjects: () => void;
    refetchStyleguides: () => void;
}

interface UseWorkspacesResultParams {
    enabled: boolean;
    workspace?: string;
    onError: (isAuthorizationError: boolean) => void;
}

export const useResources = ({ enabled, workspace, onError }: UseWorkspacesResultParams): UseResourcesResult => {
    const {
        isLoading: areProjectsLoading,
        data: projects,
        isError: projectsError,
        refetch: refetchProjects
    } = useQuery(
        ["projects", workspace],
        () => requester.getProjects(workspace),
        {
            enabled,
            retry: (failureCount, error: AxiosError) => (
                error.response?.status >= INTERNAL_SERVER_ERROR &&
                failureCount <= RETRY_COUNT
            ),
            onError: error => onError(error.response?.status === UNAUTHORIZED)
        }
    );

    const {
        isLoading: areStyleguidesLoading,
        data: styleguides,
        isError: styleguidesError,
        refetch: refetchStyleguides
    } = useQuery(
        ["styleguides", workspace],
        () => requester.getStyleguides(workspace),
        {
            enabled,
            retry: (failureCount, error: AxiosError) => (
                error.response?.status >= INTERNAL_SERVER_ERROR &&
                failureCount <= RETRY_COUNT
            ),
            onError: error => onError(error.response?.status === UNAUTHORIZED)
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
