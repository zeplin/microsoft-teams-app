import { useEffect } from "react";
import { useMutation } from "react-query";
import { app, pages } from "@microsoft/teams-js";

import { requester, url } from "../../../lib";
import { Resource, WebhookEventType } from "../../../constants";
import { ClientError } from "../../../ClientError";

interface WebhookSettings {
    webhookUrl: string;
}

const errorToText = (error: Error): string => {
    switch (error instanceof ClientError ? error.message : "") {
        case "User is not a member of the project":
            return "Only project members can setup integrations.";
        case "User is not a member of the styleguide":
            return "Only styleguide members can setup integrations.";
        case "Project not found":
        case "Project is archived":
            return "Project is not available anymore. You can select different Project/Styleguide to setup configuration.";
        case "Styleguide not found":
        case "Styleguide is archived":
            return "Styleguide is not available anymore. You can select different Project/Styleguide to setup configuration.";
        case "Only organization editor (or higher) can access project webhooks":
        case "Only organization editor (or higher) can access styleguide webhooks":
            return "Only organization editor (or higher) can setup integrations.";
        case "Only owner of the project can access webhooks":
            return "Only owner of the project can setup integrations.";
        case "Only owner of the styleguide can access webhooks":
            return "Only owner of the styleguide can setup integrations.";
        case "Cannot create a webhook with active status because provided URL is unhealthy":
        case "Owner of the webhook not found. Please contact to support@zeplin.io":
        default:
            return "We're experiencing an issue here. Please try it later or let us know: support@zeplin.io.";
    }
};

interface UseConfigurationSaveParams {
    isInitialized: boolean;
    resource?: Resource;
    workspaceId?: string;
    events?: WebhookEventType[];
    onError: (errorMessage: string) => void;
}

export const useConfigurationCreate = ({
    isInitialized,
    workspaceId,
    resource,
    events,
    onError
}: UseConfigurationSaveParams): void => {
    const [createConfiguration] = useMutation(
        requester.createConfiguration,
        {
            throwOnError: true,
            onError: error => onError(errorToText(error))
        }
    );

    async function registerConfiguration() {
        const { channel, user } = await app.getContext();
        const tenantId = user?.tenant?.id;
        const channelName = channel?.displayName;
        const channelId = channel?.id;

        const settings = await pages.getConfig();
        pages.config.registerOnSaveHandler(async saveEvent => {
            if (tenantId === undefined ||
                channelId === undefined ||
                channelName === undefined ||
                resource === undefined ||
                events === undefined ||
                workspaceId === undefined) {
                saveEvent.notifyFailure("params are not defined");
                return;
            }
            const { webhookUrl } = settings as unknown as WebhookSettings;
            try {
                const configurationId = await createConfiguration(
                    {
                        zeplin: {
                            resource: {
                                id: resource.id,
                                type: resource.type
                            },
                            workspaceId,
                            events
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

                pages.config.setConfig({
                    entityId: configurationId,
                    suggestedDisplayName: resource.name,
                    contentUrl: decodeURI(`${window.location.origin}${url.getHomeUrl({
                        id: configurationId,
                        resourceName: resource.name,
                        resourceType: resource.type,
                        channel: "{channelName}",
                        theme: "{theme}"
                    })}`)
                });

                saveEvent.notifySuccess();
            } catch (error) {
                saveEvent.notifyFailure((error as Error)?.message ?? `Unknown error ${error}`);
            }
        });
    }

    useEffect(() => {
        if (isInitialized) {
            registerConfiguration();
        }
    }, [resource, events, isInitialized]);
};