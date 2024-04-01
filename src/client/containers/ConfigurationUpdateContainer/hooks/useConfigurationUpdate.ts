import { useEffect } from "react";
import { useMutation } from "react-query";
import { app, pages } from "@microsoft/teams-js";

import { requester, url } from "../../../lib";
import { Resource, WebhookEventType } from "../../../constants";
import { ClientError } from "../../../ClientError";

const errorToText = (error: Error): string => {
    switch (error instanceof ClientError ? error.message : "") {
        case "User is not a member of the project":
            return "Only project members can update integrations settings.";
        case "User is not a member of the styleguide":
            return "Only styleguide members can update integrations settings.";
        case "Webhook not found":
            return "This integration has been removed in Zeplin. You can remove this connector and create it again.";
        case "Project not found":
        case "Project is archived":
            return "Project is not available anymore. You can remove this integration.";
        case "Styleguide not found":
        case "Styleguide is archived":
            return "Styleguide is not available anymore. You can remove this integration.";
        case "Only organization editor (or higher) can access project webhooks":
        case "Only organization editor (or higher) can access styleguide webhooks":
            return "Only organization editor (or higher) can update integration settings.";
        case "Only owner of the project can access webhooks":
            return "Only owner of the project update integration settings.";
        case "Only owner of the styleguide can access webhooks":
            return "Only owner of the styleguide update integration settings.";
        case "Cannot update webhook's URL because an active webhook's URL cannot be unhealthy":
        case "Owner of the webhook not found. Please contact to support@zeplin.io":
        default:
            return "We're experiencing an issue here. Please try it later or let us know: support@zeplin.io.";
    }
};

interface UseConfigurationUpdateParams {
    isInitialized: boolean;
    configurationId: string;
    resource?: Resource;
    workspaceId?: string;
    events?: WebhookEventType[];
    onError: (errorMessage: string) => void;
}

export const useConfigurationUpdate = ({
    isInitialized,
    configurationId,
    workspaceId,
    resource,
    events,
    onError
}: UseConfigurationUpdateParams): void => {
    const [updateConfiguration] = useMutation(
        requester.updateConfiguration,
        {
            throwOnError: true,
            onError: error => onError(errorToText(error))
        }
    );

    useEffect(() => {
        if (isInitialized) {
            app.getContext().then(({
                channel,
                user
            }) => {
                const { id: channelId, displayName: channelName } = channel ?? {};
                const { tenant: { id: tenantId } = { id: undefined } } = user ?? {};
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
                    try {
                        await updateConfiguration(
                            {
                                configurationId,
                                zeplin: {
                                    resource: {
                                        id: resource.id,
                                        type: resource.type
                                    },
                                    workspaceId,
                                    events
                                }
                            });

                        await pages.config.setConfig({
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
            });
        }
    }, [resource, events, workspaceId, isInitialized]);
};
