import React, { FunctionComponent, useState } from "react";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";

import { Resource, resourceBasedEvents, ResourceType, WebhookEventType } from "../../constants";
import {
    useLogin,
    useConfigurationSave,
    useInitialize,
    useResources,
    useValidate,
    useWorkspaces
} from "./hooks";
import { ConfigurationCreate, Login } from "./components";
import { storage } from "../../lib";
import { useMe } from "./hooks/useMe";

type State = {
    status: Status.LOADING | Status.LOGIN;
} | {
    status: Status.CONFIGURATION;
    workspace?: string;
    resourceSearch: string;
    resource?: Resource;
    events: WebhookEventType[];
};

enum Status {
    LOADING,
    LOGIN,
    CONFIGURATION
}

function isValid(state: State): boolean {
    return state.status === Status.CONFIGURATION &&
        state.workspace !== undefined &&
        state.resource !== undefined &&
        state.events.filter(
            event => resourceBasedEvents[(state.resource as Resource).type].includes(event)
        ).length > 0;
}

export const ConfigurationCreateContainer: FunctionComponent = () => {
    const { query: { channel } } = useRouter();

    const [state, setState] = useState<State>({ status: Status.LOADING });

    const {
        areWorkspacesLoading,
        workspacesError,
        workspaces,
        refetchWorkspaces
    } = useWorkspaces({
        enabled: state.status === Status.CONFIGURATION,
        onError: isAuthorizationError => {
            if (isAuthorizationError) {
                setState({ status: Status.LOGIN });
            }
        }
    });

    const {
        me
    } = useMe({
        enabled: state.status === Status.CONFIGURATION,
        onError: isAuthorizationError => {
            if (isAuthorizationError) {
                setState({ status: Status.LOGIN });
            }
        }
    });

    const {
        areResourcesLoading,
        projectsError,
        styleguidesError,
        projects,
        styleguides,
        refetchProjects,
        refetchStyleguides
    } = useResources({
        enabled: state.status === Status.CONFIGURATION && Boolean(state.workspace),
        workspace: state.status === Status.CONFIGURATION ? state.workspace : undefined,
        onProjectsSuccess: newProjects => {
            if (
                state.status === Status.CONFIGURATION &&
                state.resource &&
                state.resource.type === ResourceType.PROJECT &&
                newProjects.findIndex(({ id }) => id === state.resource?.id) === -1
            ) {
                setState(prevState => ({
                    ...prevState,
                    resourceSearch: "",
                    resource: undefined
                }));
            }
        },
        onStyleguidesSuccess: newStyleguides => {
            if (
                state.status === Status.CONFIGURATION &&
                state.resource &&
                state.resource.type === ResourceType.STYLEGUIDE &&
                newStyleguides.findIndex(({ id }) => id === state.resource?.id) === -1
            ) {
                setState(prevState => ({
                    ...prevState,
                    resourceSearch: "",
                    resource: undefined
                }));
            }
        },
        onError: isAuthorizationError => {
            if (isAuthorizationError) {
                setState({ status: Status.LOGIN });
            }
        }

    });

    const [login, { loginError }] = useLogin({
        onSuccess: () => setState({
            status: Status.CONFIGURATION,
            events: Object.values(WebhookEventType),
            resourceSearch: ""
        })
    });

    useInitialize({
        onSuccess: () => setState(
            storage.getAccessToken()
                ? {
                    status: Status.CONFIGURATION,
                    events: Object.values(WebhookEventType),
                    resourceSearch: ""
                }
                : { status: Status.LOGIN }
        )
    });

    useValidate({
        enabled: state.status !== Status.LOADING,
        valid: isValid(state)
    });

    useConfigurationSave({
        enabled: state.status === Status.CONFIGURATION,
        resource: state.status === Status.CONFIGURATION ? state.resource : undefined,
        events: state.status === Status.CONFIGURATION ? state.events : undefined
    });

    switch (state.status) {
        case Status.LOADING:
            return <Loader styles={{ height: "100vh" }} />;
        case Status.LOGIN:
            return <Login onButtonClick={login} error={loginError} />;
        case Status.CONFIGURATION:
            return (
                <ConfigurationCreate
                    channelName={String(channel)}
                    areWorkspacesLoading={areWorkspacesLoading}
                    workspaces={workspaces || []}
                    isWorkspaceSelected={Boolean(state.workspace)}
                    resourceType={state.resource?.type ?? ResourceType.PROJECT}
                    areResourcesLoading={areResourcesLoading}
                    projects={projects || []}
                    styleguides={styleguides || []}
                    selectedWebhookEvents={state.events}
                    isError={styleguidesError || projectsError || workspacesError}
                    resourceSearch={state.resourceSearch}
                    username={me?.username}
                    onResourceSearch={(resourceSearch): void => {
                        setState(prevState => ({
                            ...prevState,
                            resourceSearch
                        }));
                    }}
                    onRetryClick={(): void => {
                        if (workspacesError) {
                            refetchWorkspaces();
                        }
                        if (projectsError) {
                            refetchProjects();
                        }
                        if (styleguidesError) {
                            refetchStyleguides();
                        }
                    }}
                    onResourceDropdownBlur={(): void => setState(prevState => ({
                        ...prevState,
                        resourceSearch:
                            prevState.status === Status.CONFIGURATION
                                ? prevState.resource?.name ?? ""
                                : ""
                    }))}
                    onResourceDropdownFocus={(): void => setState(prevState => ({
                        ...prevState,
                        resourceSearch: ""
                    }))}
                    onWorkspaceChange={(workspace): void => setState(prevState => ({
                        ...prevState,
                        workspace,
                        resourceSearch: "",
                        resource: undefined
                    }))}
                    onResourceChange={(resource): void => setState(prevState => ({
                        ...prevState,
                        resource,
                        resourceSearch: resource.name
                    }))}
                    onWebhookEventsChange={(events): void => setState(prevState => ({
                        ...prevState,
                        events
                    }))}
                    onLogoutClick={(): void => {
                        storage.removeRefreshToken();
                        storage.removeAccessToken();
                        setState({ status: Status.LOGIN });
                    }}
                />
            );
        default:
            throw new Error();
    }
};
