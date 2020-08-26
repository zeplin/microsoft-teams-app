import { useEffect } from "react";
import { useMutation } from "react-query";
import * as microsoftTeams from "@microsoft/teams-js";

import { fetchConfigurationCreate, fetchConfigurationUpdate } from "../../../requester";
import { State } from "./useHomeReducer";
import { useRouter } from "next/router";

interface WebhookSettings {
    webhookUrl: string;
}

export const useConfigurationSave = (state: State): void => {
    const { query: { id } } = useRouter();
    const [createConfiguration] = useMutation(fetchConfigurationCreate, { throwOnError: true });
    const [updateConfiguration] = useMutation(fetchConfigurationUpdate, { throwOnError: true });

    useEffect(() => {
        microsoftTeams.getContext(({
            channelId,
            channelName,
            tid: tenantId
        }) => {
            microsoftTeams.settings.getSettings(settings => {
                microsoftTeams.settings.registerOnSaveHandler(async saveEvent => {
                    const { webhookUrl } = settings as unknown as WebhookSettings;
                    try {
                        if (id) {
                            await updateConfiguration(
                                {
                                    accessToken: state.accessToken,
                                    configurationId: String(id),
                                    zeplin: {
                                        resource: {
                                            id: state.selectedResource.id,
                                            type: state.selectedResource.type
                                        },
                                        events: state.selectedWebhookEvents
                                    }
                                });
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

                            const contentURL = new URL(window.location.href);
                            contentURL.searchParams.set("id", configurationId);
                            contentURL.searchParams.set("theme", "{theme}");
                            contentURL.searchParams.set("channel", "{channelName}");

                            microsoftTeams.settings.setSettings({
                                entityId: configurationId,
                                configName: state.selectedResource.name,
                                contentUrl: decodeURI(contentURL.toString())
                            } as unknown as microsoftTeams.settings.Settings);
                        }

                        saveEvent.notifySuccess();
                    } catch (error) {
                        saveEvent.notifyFailure(error?.message ?? error);
                    }
                });
            });
        });
    }, [state.selectedWorkspace, state.selectedResource, state.selectedWebhookEvents]);
};
