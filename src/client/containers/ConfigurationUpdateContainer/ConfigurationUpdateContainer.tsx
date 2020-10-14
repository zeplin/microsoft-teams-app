import React, { FunctionComponent, useState } from "react";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";

import { ResourceType, WebhookEventType } from "../../constants";
import { ConfigurationUpdate } from "./components";
import { storage, url } from "../../lib";
import { useMe, useInitialize } from "../../hooks";
import { useConfiguration, useConfigurationDelete, useConfigurationUpdate, useValidate } from "./hooks";

export const ConfigurationUpdateContainer: FunctionComponent = () => {
    const { isInitializeLoading } = useInitialize();

    const { query: { channel, id, resourceName, resourceType }, replace } = useRouter();

    const [events, setEvents] = useState<WebhookEventType[]>([]);
    const [configurationUpdateError, setConfigurationUpdateError] = useState<string|undefined>(undefined);

    const {
        me
    } = useMe({
        onError: isAuthorizationError => {
            if (isAuthorizationError) {
                replace(url.login);
            }
        }
    });

    const {
        configuration,
        isConfigurationLoading,
        isConfigurationError,
        isConfigurationErrorPermanent,
        refetchConfiguration,
        configurationError
    } = useConfiguration({
        configurationId: String(id),
        onError: isAuthorizationError => {
            if (isAuthorizationError) {
                replace(url.login);
            }
        },
        onSuccess: result => setEvents(result.webhook.events)
    });

    useValidate({
        enabled: !isInitializeLoading,
        resource: configuration?.resource,
        initialEvents: configuration?.webhook.events,
        events
    });

    useConfigurationUpdate({
        configurationId: String(id),
        resource: configuration?.resource,
        events,
        workspaceId: configuration?.workspaceId,
        onError: errorMessage => {
            setConfigurationUpdateError(errorMessage);
        }
    });

    useConfigurationDelete({
        configurationId: String(id)
    });

    if (isConfigurationLoading || isInitializeLoading) {
        return <Loader styles={{ height: "100vh" }} />;
    }

    return (
        <ConfigurationUpdate
            channelName={String(channel)}
            resource={configuration?.resource ?? {
                name: resourceName as string,
                type: resourceType as ResourceType,
                id: "dummyId"
            }}
            selectedWebhookEvents={events}
            disabled={isConfigurationError}
            errorMessage={configurationError || configurationUpdateError}
            hideRetry={Boolean(configurationUpdateError) || isConfigurationErrorPermanent}
            username={me?.username}
            onRetryClick={(): void => {
                refetchConfiguration();
            }}
            onWebhookEventsChange={(nextEvents): void => {
                setEvents(nextEvents);
                setConfigurationUpdateError(undefined);
            }}
            onLogoutClick={(): void => {
                storage.removeRefreshToken();
                storage.removeAccessToken();
                replace(url.login);
                setConfigurationUpdateError(undefined);
            }}
        />
    );
};
