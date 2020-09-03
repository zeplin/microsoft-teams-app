import React, { FunctionComponent, useState } from "react";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";

import { Resource, resourceBasedEvents, WebhookEventType } from "../../constants";
import {
    useLogin,
    useConfiguration,
    useConfigurationDelete,
    useConfigurationSave,
    useInitialize,
    useValidate
} from "./hooks";
import { ConfigurationUpdate, Login } from "./components";
import { storage } from "../../lib";

type State = {
    status: Status.LOADING | Status.LOGIN | Status.LOADING_CONFIGURATION;
} | {
    status: Status.CONFIGURATION;
    resource: Resource;
    events: WebhookEventType[];
    initialEvents: WebhookEventType[];
};

enum Status {
    LOADING,
    LOGIN,
    LOADING_CONFIGURATION,
    CONFIGURATION
}

function areDifferent<T>(left: T[], right: T[]): boolean {
    return left.length !== right.length || left.some(value => !right.includes(value));
}

function isValid(state: State): boolean {
    if (state.status !== Status.CONFIGURATION || !state.resource) {
        return false;
    }
    const currentEvents = state.events.filter(
        event => resourceBasedEvents[state.resource.type].includes(event)
    );
    const initialEvents = state.initialEvents.filter(
        event => resourceBasedEvents[state.resource.type].includes(event)
    );
    return currentEvents.length > 0 && areDifferent(currentEvents, initialEvents);
}

export const ConfigurationUpdateContainer: FunctionComponent = () => {
    const { query: { channel, id } } = useRouter();

    const [state, setState] = useState<State>({ status: Status.LOADING });

    useConfiguration({
        enabled: state.status === Status.LOADING_CONFIGURATION,
        configurationId: String(id),
        onSuccess: ({ resource, webhook: { events } }) => setState({
            status: Status.CONFIGURATION,
            resource,
            events,
            initialEvents: events
        })
    });

    const [login, { loginError }] = useLogin({
        onSuccess: () => setState({ status: Status.LOADING_CONFIGURATION })
    });

    useInitialize({
        onSuccess: () => setState({ status: storage.getAccessToken() ? Status.LOADING_CONFIGURATION : Status.LOGIN })
    });

    useValidate({
        enabled: state.status !== Status.LOADING,
        valid: isValid(state)
    });

    useConfigurationSave({
        enabled: state.status === Status.CONFIGURATION,
        configurationId: String(id),
        resource: state.status === Status.CONFIGURATION ? state.resource : undefined,
        events: state.status === Status.CONFIGURATION ? state.events : undefined
    });

    useConfigurationDelete({
        configurationId: String(id)
    });

    switch (state.status) {
        case Status.LOADING:
        case Status.LOADING_CONFIGURATION:
            return <Loader styles={{ height: "100vh" }} />;
        case Status.LOGIN:
            return <Login onButtonClick={login} error={loginError} />;
        case Status.CONFIGURATION:
            return (
                <ConfigurationUpdate
                    channelName={String(channel)}
                    resource={state.resource}
                    selectedWebhookEvents={state.events}
                    onWebhookEventsChange={(events): void => setState(prevState => ({
                        ...prevState,
                        events
                    }))} />
            );
        default:
            throw new Error();
    }
};
