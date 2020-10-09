import { useEffect } from "react";
import { useMutation } from "react-query";
import * as microsoftTeams from "@microsoft/teams-js";

import { requester } from "../../../lib";
import { Resource, ResourceType, WebhookEventType } from "../../../constants";
import { errorToText } from "./errorToText";

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

interface UseConfigurationUpdateParams {
    configurationId: string;
    resource?: Resource;
    workspaceId?: string;
    events?: WebhookEventType[];
    onError: (errorMessage: string) => void;
}

export const useConfigurationUpdate = ({
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
        microsoftTeams.getContext(({
            channelId,
            channelName,
            tid: tenantId
        }) => {
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

                    setSettings(configurationId, resource.name, resource.type);

                    saveEvent.notifySuccess();
                } catch (error) {
                    saveEvent.notifyFailure(error?.message ?? error);
                }
            });
        });
    }, [resource, events, workspaceId]);
};
