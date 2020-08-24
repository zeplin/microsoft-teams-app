import React, {
    FunctionComponent,
    useReducer,
    useEffect
} from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";

import {
    createConfiguration,
    getProjects,
    getStyleguides,
    getWorkspaces,
    resourceBasedEvents,
    ResourceType
} from "../../requester";
import {
    ActionType,
    homeReducer,
    initialState,
    Status,
    State
} from "./homeReducer";
import { Configuration, Login } from "./components";

interface WebhookSettings {
    webhookUrl: string;
}

function isValidState(state: State): boolean {
    return state.status === Status.CONFIGURATION &&
        Boolean(state.accessToken) &&
        Boolean(state.selectedWorkspace) &&
        Boolean(state.selectedResource) &&
        state.selectedWebhookEvents.filter(
            event => resourceBasedEvents[state.selectedResource.type].includes(event)
        ).length > 0;
}

export const HomeContainer: FunctionComponent = () => {
    const {
        query: {
            channel
        }
    } = useRouter();

    const [state, dispatch] = useReducer(homeReducer, initialState);

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
        (key, workspace, accessToken) => getProjects(workspace, accessToken),
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
        (key, workspace, accessToken) => getStyleguides(workspace, accessToken),
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

    const isValid = isValidState(state);

    useEffect(() => {
        microsoftTeams.initialize(() => {
            microsoftTeams.settings.setValidityState(isValid);
        });
    }, [isValid]);

    const [create] = useMutation(createConfiguration, { throwOnError: true });

    useEffect(() => {
        microsoftTeams.initialize(() => {
            microsoftTeams.getContext(({
                channelId,
                channelName,
                tid: tenantId
            }) => {
                microsoftTeams.settings.getSettings(settings => {
                    microsoftTeams.settings.registerOnSaveHandler(async saveEvent => {
                        const { webhookUrl } = settings as unknown as WebhookSettings;
                        try {
                            const configurationId = await create(
                                {
                                    accessToken: state.accessToken,
                                    zeplin: {
                                        resource: {
                                            id: state.selectedResource.id,
                                            type: state.selectedResource.type
                                        },
                                        events: state.selectedWebhookEvents
                                    },
                                    microsoftTeams: {
                                        channel: {
                                            id: channelId,
                                            name: channelName
                                        },
                                        tenantId,
                                        incomingWebhookUrl: webhookUrl
                                    }
                                });

                            const contentURL = new URL(window.location.href);
                            contentURL.searchParams.append("id", configurationId);

                            microsoftTeams.settings.setSettings({
                                entityId: configurationId,
                                configName: state.selectedResource.name,
                                contentUrl: contentURL.toString()
                            } as unknown as microsoftTeams.settings.Settings);
                            saveEvent.notifySuccess();
                        } catch (error) {
                            saveEvent.notifyFailure(error?.message ?? error);
                        }
                    });
                });
            });
        });
    }, [state.selectedWorkspace, state.selectedResource, state.selectedWebhookEvents]);

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
