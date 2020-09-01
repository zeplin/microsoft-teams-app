import { useQuery } from "react-query";

import { fetchProjects, fetchStyleguides, Project, Styleguide } from "../../../lib/requester";
import { State, Status } from "./useHomeReducer";

interface UseResourcesResult {
    areResourcesLoading: boolean;
    projects: Project[];
    styleguides: Styleguide[];
}

export const useResources = (state: State): UseResourcesResult => {
    const enabled = !state.configurationId && state.selectedWorkspace && state.status === Status.CONFIGURATION;

    const { isLoading: areProjectsLoading, data: projects } = useQuery(
        ["projects", state.selectedWorkspace],
        (key, workspace) => fetchProjects(workspace),
        { enabled }
    );

    const { isLoading: areStyleguidesLoading, data: styleguides } = useQuery(
        ["styleguides", state.selectedWorkspace],
        (key, workspace) => fetchStyleguides(workspace),
        { enabled }
    );

    return {
        areResourcesLoading: areProjectsLoading || areStyleguidesLoading,
        styleguides,
        projects
    };
};
