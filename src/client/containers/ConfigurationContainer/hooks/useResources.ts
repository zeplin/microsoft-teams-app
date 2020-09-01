import { useQuery } from "react-query";

import { requester } from "../../../lib";
import { Project, Styleguide } from "../../../constants";

interface UseResourcesResult {
    areResourcesLoading: boolean;
    projects: Project[];
    styleguides: Styleguide[];
}

interface UseWorkspacesResultParams {
    enabled: boolean;
    workspace?: string;
}

export const useResources = ({ enabled, workspace }: UseWorkspacesResultParams): UseResourcesResult => {
    const { isLoading: areProjectsLoading, data: projects } = useQuery(
        ["projects", workspace],
        () => requester.getProjects(workspace),
        { enabled }
    );

    const { isLoading: areStyleguidesLoading, data: styleguides } = useQuery(
        ["styleguides", workspace],
        () => requester.getStyleguides(workspace),
        { enabled }
    );

    return {
        areResourcesLoading: areProjectsLoading || areStyleguidesLoading,
        styleguides,
        projects
    };
};
