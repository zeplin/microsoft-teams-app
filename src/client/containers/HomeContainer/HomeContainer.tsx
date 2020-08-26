import React, { FunctionComponent } from "react";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";

import { ResourceType } from "../../requester";
import {
    ActionType,
    Status,
    useConfigurationSave,
    useConfigurationDelete,
    useHomeReducer,
    useInitialize,
    useResources,
    useValidate,
    useStateUpdateFromConfiguration,
    useWorkspaces,
    useAuthenticate
} from "./hooks";
import { Configuration, Login } from "./components";

export const HomeContainer: FunctionComponent = () => {
    const { query: { channel, id } } = useRouter();

    const [state, dispatch] = useHomeReducer();

    const { areWorkspacesLoading, workspaces } = useWorkspaces(state);
    const { areResourcesLoading, projects, styleguides } = useResources(state);
    const { isStateUpdateLoading } = useStateUpdateFromConfiguration(state, dispatch);
    const authenticate = useAuthenticate(dispatch);

    useInitialize(dispatch);
    useValidate(state);
    useConfigurationSave(state);
    useConfigurationDelete(state);

    if (isStateUpdateLoading) {
        return <Loader styles={{ height: "100vh" }} />;
    }

    switch (state.status) {
        case Status.LOADING:
            return <Loader styles={{ height: "100vh" }} />;
        case Status.LOGIN:
            return <Login onButtonClick={authenticate} />;
        case Status.CONFIGURATION:
            return (
                <Configuration
                    isConfigurationCreated={Boolean(id)}
                    channelName={String(channel)}
                    areWorkspacesLoading={areWorkspacesLoading}
                    workspaces={workspaces || []}
                    isWorkspaceSelected={Boolean(state.selectedWorkspace)}
                    resourceType={state.selectedResource?.type ?? ResourceType.PROJECT}
                    resourceName={state.selectedResource?.name}
                    areResourcesLoading={areResourcesLoading}
                    projects={projects || []}
                    styleguides={styleguides || []}
                    selectedWebhookEvents={state.selectedWebhookEvents}
                    onWorkspaceChange={(value): void => dispatch({
                        type: ActionType.SET_SELECTED_WORKSPACE,
                        value
                    })}
                    onResourceChange={(value): void => dispatch({ type: ActionType.SET_SELECTED_RESOURCE, value })}
                    onWebhookEventChange={(value): void => dispatch({
                        type: ActionType.TOGGLE_SELECTED_WEBHOOK_EVENT,
                        value
                    })}
                />
            );
        default:
            throw new Error();
    }
};
