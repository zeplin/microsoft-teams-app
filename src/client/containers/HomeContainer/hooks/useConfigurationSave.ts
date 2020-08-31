import { useEffect } from "react";
import { useMutation } from "react-query";
import * as microsoftTeams from "@microsoft/teams-js";

import { fetchConfigurationCreate, fetchConfigurationUpdate } from "../../../requester";
import { State, Status } from "./useHomeReducer";

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

export const useConfigurationSave = (state: State): void => {
    const [createConfiguration] = useMutation(fetchConfigurationCreate, { throwOnError: true });
    const [updateConfiguration] = useMutation(fetchConfigurationUpdate, { throwOnError: true });

    useEffect(() => {
        if (state.status === Status.CONFIGURATION) {
            microsoftTeams.getContext(({
                channelId,
                channelName,
                tid: tenantId
            }) => {
                microsoftTeams.settings.getSettings(settings => {
                    microsoftTeams.settings.registerOnSaveHandler(async saveEvent => {
                        const { webhookUrl } = settings as unknown as WebhookSettings;
                        try {
                            if (state.configurationId) {
                                await updateConfiguration(
                                    {
                                        accessToken: state.accessToken,
                                        configurationId: state.configurationId,
                                        zeplin: {
                                            resource: {
                                                id: state.selectedResource.id,
                                                type: state.selectedResource.type
                                            },
                                            events: state.selectedWebhookEvents
                                        }
                                    });

                                setSettings(state.configurationId, state.selectedResource.name);
                            } else {
                                const configurationId = await createConfiguration(
                                    {
                                        accessToken: state.accessToken,
                                        zeplin: {
                                            resource: {
                                                id: state.selectedResource.id,
                                                type: state.selectedResource.type
                                            },
                                            events: state.selectedWebhookEvents
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

                                setSettings(configurationId, state.selectedResource.name);
                            }

                            saveEvent.notifySuccess();
                        } catch (error) {
                            saveEvent.notifyFailure(error?.message ?? error);
                        }
                    });
                });
            });
        }
    }, [state.selectedWorkspace, state.selectedResource, state.selectedWebhookEvents]);
};
