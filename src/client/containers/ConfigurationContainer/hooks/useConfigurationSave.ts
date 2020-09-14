import { useEffect } from "react";
import { useMutation } from "react-query";
import * as microsoftTeams from "@microsoft/teams-js";

import { requester } from "../../../lib";
import { Resource, ResourceType, WebhookEventType } from "../../../constants";

interface WebhookSettings {
    webhookUrl: string;
}

function setSettings(configurationId: string, resourceName: string, resourceType: ResourceType): void {
    const contentURL = new URL(window.location.href);
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
    enabled: boolean;
    configurationId?: string;
    resource?: Resource;
    events?: WebhookEventType[];
}

export const useConfigurationSave = ({
    enabled,
    configurationId,
    resource,
    events
}: UseConfigurationSaveParams): void => {
    const [createConfiguration] = useMutation(requester.createConfiguration, { throwOnError: true });
    const [updateConfiguration] = useMutation(requester.updateConfiguration, { throwOnError: true });

    useEffect(() => {
        if (enabled) {
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
                            events === undefined) {
                            saveEvent.notifyFailure("params are not defined");
                            return;
                        }
                        const { webhookUrl } = settings as unknown as WebhookSettings;
                        try {
                            if (configurationId) {
                                await updateConfiguration(
                                    {
                                        configurationId,
                                        zeplin: {
                                            resource: {
                                                id: resource.id,
                                                type: resource.type
                                            },
                                            events
                                        }
                                    });

                                setSettings(configurationId, resource.name, resource.type);
                            } else {
                                const newConfigurationId = await createConfiguration(
                                    {
                                        zeplin: {
                                            resource: {
                                                id: resource.id,
                                                type: resource.type
                                            },
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
                            }

                            saveEvent.notifySuccess();
                        } catch (error) {
                            saveEvent.notifyFailure(error?.message ?? error);
                        }
                    });
                });
            });
        }
    }, [resource, events, enabled]);
};
