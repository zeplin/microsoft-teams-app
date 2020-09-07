import { useEffect } from "react";
import { useMutation } from "react-query";
import * as microsoftTeams from "@microsoft/teams-js";

import { requester } from "../../../lib";
import { Resource, WebhookEventType } from "../../../constants";

interface WebhookSettings {
    webhookUrl: string;
}

function setSettings(configurationId: string, configurationName: string): void {
    const contentURL = new URL(window.location.href);
    contentURL.searchParams.set("id", configurationId);
    contentURL.searchParams.set("theme", "{theme}");
    contentURL.searchParams.set("channel", "{channelName}");

    microsoftTeams.settings.setSettings({
        entityId: configurationId,
        configName: configurationName,
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
                    if (tenantId && channelId && channelName && resource && events) {
                        microsoftTeams.settings.registerOnSaveHandler(async saveEvent => {
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

                                    setSettings(configurationId, resource.name);
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

                                    setSettings(newConfigurationId, resource.name);
                                }

                                saveEvent.notifySuccess();
                            } catch (error) {
                                saveEvent.notifyFailure(error?.message ?? error);
                            }
                        });
                    }
                });
            });
        }
    }, [resource, events, enabled]);
};
