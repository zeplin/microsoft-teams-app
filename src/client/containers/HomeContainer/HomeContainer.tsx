import React, {
    FunctionComponent, useEffect, useReducer
} from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";

import { Configuration, Login } from "./components";
import { BASE_URL } from "../../config";
import { useQuery } from "react-query";
import { getWorkspaces, ResourceType } from "../../requester";
import { ActionType, homeReducer, Status } from "./homeReducer";

export const HomeContainer: FunctionComponent = () => {
    const {
        query: {
            channel
        }
    } = useRouter();

    const [state, dispatch] = useReducer(homeReducer, { status: Status.LOADING });

    const { isLoading: isWorkspacesLoading, data: workspaces } = useQuery(
        ["workspaces", state.status === Status.CONFIGURATION ? state.accessToken : null],
        (key, accessToken) => getWorkspaces(accessToken),
        {
            enabled: state.status === Status.CONFIGURATION
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
                    url: `${BASE_URL}/api/auth/authorize`
                });
            }} />;
        case Status.CONFIGURATION:
            return (
                <Configuration
                    channelName={String(channel)}
                    isWorkspacesLoading={isWorkspacesLoading}
                    workspaces={workspaces || []}
                    isWorkspaceSelected={Boolean(state.selectedWorkspace)}
                    resourceType={state.selectedResource?.type ?? ResourceType.PROJECT }
                    onWorkspaceChange={(value): void => dispatch({ type: ActionType.SET_SELECTED_WORKSPACE, value })}
                    onResourceChange={(value): void => dispatch({ type: ActionType.SET_SELECTED_RESOURCE, value })}
                />
            );
        default:
            throw new Error();
    }
};
