import React, {
    FunctionComponent,
    useReducer,
    useEffect
} from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { Configuration, Login } from "./components";
import { getProjects, getStyleguides, getWorkspaces, ResourceType } from "../../requester";
import { ActionType, homeReducer, Status } from "./homeReducer";

export const HomeContainer: FunctionComponent = () => {
    const {
        query: {
            channel
        }
    } = useRouter();

    const [state, dispatch] = useReducer(homeReducer, { status: Status.LOADING });

    const { isLoading: areWorkspacesLoading, data: workspaces } = useQuery(
        ["workspaces", state.status === Status.CONFIGURATION && state.accessToken],
        (key, accessToken) => getWorkspaces(accessToken),
        {
            enabled: state.status === Status.CONFIGURATION
        }
    );

    const { isLoading: areProjectsLoading, data: projects } = useQuery(
        [
            "projects",
            state.status === Status.CONFIGURATION && state.selectedWorkspace,
            state.status === Status.CONFIGURATION && state.accessToken
        ],
        (key, workspaceId, accessToken) => getProjects(workspaceId, accessToken),
        {
            enabled: state.status === Status.CONFIGURATION && state.selectedWorkspace
        }
    );

    const { isLoading: areStyleguidesLoading, data: styleguides } = useQuery(
        [
            "styleguides",
            state.status === Status.CONFIGURATION && state.selectedWorkspace,
            state.status === Status.CONFIGURATION && state.accessToken
        ],
        (key, workspaceId, accessToken) => getStyleguides(workspaceId, accessToken),
        {
            enabled: state.status === Status.CONFIGURATION && state.selectedWorkspace
        }
    );

    useEffect(() => {
        microsoftTeams.initialize(() => {
            microsoftTeams.appInitialization.notifySuccess();
            dispatch({ type: ActionType.COMPLETE_LOADING });
        });
    }, []);

    switch (state.status) {
        case Status.LOADING:
            return <Loader id="loader-home"/>;
        case Status.LOGIN:
            return <Login onButtonClick={(): void => {
                microsoftTeams.authentication.authenticate({
                    height: 476,
                    successCallback: value => dispatch({ type: ActionType.GET_TOKEN, value }),
                    url: "/api/auth/authorize"
                });
            }} />;
        case Status.CONFIGURATION:
            return (
                <Configuration
                    channelName={String(channel)}
                    areWorkspacesLoading={areWorkspacesLoading}
                    workspaces={workspaces || []}
                    isWorkspaceSelected={Boolean(state.selectedWorkspace)}
                    resourceType={state.selectedResource?.type ?? ResourceType.PROJECT }
                    areResourcesLoading={areStyleguidesLoading || areProjectsLoading}
                    projects={projects || []}
                    styleguides={styleguides || []}
                    onWorkspaceChange={(value): void => dispatch({ type: ActionType.SET_SELECTED_WORKSPACE, value })}
                    onResourceChange={(value): void => dispatch({ type: ActionType.SET_SELECTED_RESOURCE, value })}
                />
            );
        default:
            throw new Error();
    }
};
