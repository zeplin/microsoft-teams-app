import { useQuery } from "react-query";
import { fetchProjects, fetchStyleguides, Project, Styleguide } from "../../../requester";
import { State } from "./useHomeReducer";

interface UseResourcesResult {
    areResourcesLoading: boolean;
    projects: Project[];
    styleguides: Styleguide[];
}

export const useResources = (state: State): UseResourcesResult => {
    const { isLoading: areProjectsLoading, data: projects } = useQuery(
        [
            "projects",
            state.selectedWorkspace,
            state.accessToken
        ],
        (key, workspace, accessToken) => fetchProjects(workspace, accessToken),
        {
            enabled: state.selectedWorkspace && state.accessToken
        }
    );

    const { isLoading: areStyleguidesLoading, data: styleguides } = useQuery(
        [
            "styleguides",
            state.selectedWorkspace,
            state.accessToken
        ],
        (key, workspace, accessToken) => fetchStyleguides(workspace, accessToken),
        {
            enabled: state.selectedWorkspace && state.accessToken
        }
    );
    return {
        areResourcesLoading: areProjectsLoading || areStyleguidesLoading,
        styleguides,
        projects
    };
};
