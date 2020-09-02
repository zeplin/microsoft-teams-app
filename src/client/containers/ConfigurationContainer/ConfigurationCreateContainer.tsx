import React, { FunctionComponent, useState } from "react";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";

import { Resource, resourceBasedEvents, ResourceType, WebhookEventType } from "../../constants";
import {
    useAuthenticate,
    useConfigurationSave,
    useInitialize,
    useResources,
    useValidate,
    useWorkspaces
} from "./hooks";
import { ConfigurationCreate, Login } from "./components";
import { storage } from "../../lib";

type State = {
    status: Status.LOADING | Status.LOGIN;
} | {
    status: Status.CONFIGURATION;
    workspace?: string;
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
        Boolean(state.workspace) &&
        Boolean(state.resource) &&
        state.events.filter(
            event => resourceBasedEvents[state.resource.type].includes(event)
        ).length > 0;
}

export const ConfigurationCreateContainer: FunctionComponent = () => {
    const { query: { channel } } = useRouter();

    const [state, setState] = useState<State>({ status: Status.LOADING });

    const { areWorkspacesLoading, workspaces } = useWorkspaces({ enabled: state.status === Status.CONFIGURATION });
    const { areResourcesLoading, projects, styleguides } = useResources({
        enabled: state.status === Status.CONFIGURATION && Boolean(state.workspace),
        workspace: state.status === Status.CONFIGURATION ? state.workspace : undefined
    });

    const authenticate = useAuthenticate({
        onSuccess: () => setState({
            status: Status.CONFIGURATION,
            events: Object.values(WebhookEventType)
        })
    });

    useInitialize({
        onSuccess: () => setState(
            storage.getAccessToken()
                ? { status: Status.CONFIGURATION, events: Object.values(WebhookEventType) }
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
            return <Login onButtonClick={authenticate} />;
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
                    onWorkspaceChange={(workspace): void => setState(prevState => ({
                        ...prevState,
                        workspace,
                        resource: undefined
                    }))}
                    onResourceChange={(resource): void => setState(prevState => ({
                        ...prevState,
                        resource
                    }))}
                    onWebhookEventsChange={(events): void => setState(prevState => ({
                        ...prevState,
                        events
                    }))}
                />
            );
        default:
            throw new Error();
    }
};
