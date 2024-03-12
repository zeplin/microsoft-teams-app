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

    const routerParams = useRouter();

    const { query: {
        channel, id, resourceName, resourceType, theme
    }, replace } = routerParams;

    console.log("ConfigUpdateContainer --> routerParams:", JSON.stringify(routerParams, null, 4));

    const [events, setEvents] = useState<WebhookEventType[]>([]);
    const [configurationUpdateError, setConfigurationUpdateError] = useState<string|undefined>(undefined);

    const {
        me
    } = useMe({
        onError: isAuthorizationError => {
            if (isAuthorizationError) {
                replace(url.getLoginUrl({
                    channel: channel as string,
                    id: id as string,
                    resourceName: resourceName as string,
                    resourceType: resourceType as string,
                    theme: theme as string
                }));
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
                replace(url.getLoginUrl({
                    channel: channel as string,
                    id: id as string,
                    resourceName: resourceName as string,
                    resourceType: resourceType as string,
                    theme: theme as string
                }));
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
        isInitialized: !isInitializeLoading,
        configurationId: id as string,
        resource: configuration?.resource,
        events,
        workspaceId: configuration?.workspaceId,
        onError: errorMessage => {
            setConfigurationUpdateError(errorMessage);
        }
    });

    useConfigurationDelete({
        isInitialized: !isInitializeLoading,
        configurationId: id as string
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
                replace(url.getLoginUrl({
                    channel: channel as string,
                    id: id as string,
                    resourceName: resourceName as string,
                    resourceType: resourceType as string,
                    theme: theme as string
                }));
                setConfigurationUpdateError(undefined);
            }}
        />
    );
};
