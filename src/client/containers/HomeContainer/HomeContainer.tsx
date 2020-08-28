import React, { FunctionComponent } from "react";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";

import { ResourceType } from "../../requester";
import {
    ActionType,
    Status,
    useAuthenticate,
    useConfigurationDelete,
    useConfigurationSave,
    useHomeReducer,
    useInitialize,
    useResources,
    useStateUpdateFromConfiguration,
    useValidate,
    useWorkspaces
} from "./hooks";
import { ConfigurationCreate, ConfigurationUpdate, Login } from "./components";

export const HomeContainer: FunctionComponent = () => {
    const { query: { channel, id } } = useRouter();

    const [state, dispatch] = useHomeReducer();

    const { areWorkspacesLoading, workspaces } = useWorkspaces(state);
    const { areResourcesLoading, projects, styleguides } = useResources(state);
    useStateUpdateFromConfiguration(state, dispatch);
    const authenticate = useAuthenticate(dispatch);

    useInitialize(dispatch);
    useValidate(state);
    useConfigurationSave(state);
    useConfigurationDelete(state);

    switch (state.status) {
        case Status.LOADING:
        case Status.LOADING_CONFIGURATION:
            return <Loader styles={{ height: "100vh" }} />;
        case Status.LOGIN:
            return <Login onButtonClick={authenticate} />;
        case Status.CONFIGURATION:
            if (id) {
                return (
                    <ConfigurationUpdate
                        channelName={String(channel)}
                        resource={state.selectedResource}
                        selectedWebhookEvents={state.selectedWebhookEvents}
                        onWebhookEventChange={(value): void => dispatch({
                            type: ActionType.TOGGLE_SELECTED_WEBHOOK_EVENT,
                            value
                        })} />
                );
            }
            return (
                <ConfigurationCreate
                    isConfigurationCreated={Boolean(id)}
                    channelName={String(channel)}
                    areWorkspacesLoading={areWorkspacesLoading}
                    workspaces={workspaces || []}
                    isWorkspaceSelected={Boolean(state.selectedWorkspace)}
                    resourceType={state.selectedResource?.type ?? ResourceType.PROJECT}
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
