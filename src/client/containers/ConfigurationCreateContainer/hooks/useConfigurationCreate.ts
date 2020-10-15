import { useEffect } from "react";
import { useMutation } from "react-query";
import * as microsoftTeams from "@microsoft/teams-js";

import { requester } from "../../../lib";
import { Resource, ResourceType, WebhookEventType } from "../../../constants";
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

function setSettings(configurationId: string, resourceName: string, resourceType: ResourceType): void {
    const contentURL = new URL(window.location.href);
    contentURL.pathname = "/";
    contentURL.searchParams.set("id", configurationId);
    contentURL.searchParams.set("theme", "{theme}");
    contentURL.searchParams.set("channel", "{channelName}");
    contentURL.searchParams.set("resourceName", resourceName);
    contentURL.searchParams.set("resourceType", resourceType);

    microsoftTeams.settings.setSettings({
        entityId: configurationId,
        configName: resourceName,
        contentUrl: decodeURI(contentURL.toString())
    } as unknown as microsoftTeams.settings.Settings);
}

interface UseConfigurationSaveParams {
    resource?: Resource;
    workspaceId?: string;
    events?: WebhookEventType[];
    onError: (errorMessage: string) => void;
}

export const useConfigurationCreate = ({
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

    useEffect(() => {
        microsoftTeams.getContext(({
            channelId,
            channelName,
            tid: tenantId
        }) => {
            microsoftTeams.settings.getSettings(settings => {
                microsoftTeams.settings.registerOnSaveHandler(async saveEvent => {
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
                        const newConfigurationId = await createConfiguration(
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

                        setSettings(newConfigurationId, resource.name, resource.type);

                        saveEvent.notifySuccess();
                    } catch (error) {
                        saveEvent.notifyFailure(error?.message ?? error);
                    }
                });
            });
        });
    }, [resource, events]);
};
