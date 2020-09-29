import { httpClient } from "./httpClient";
import { Configuration, resourceBasedEvents, ResourceType, WebhookEventType } from "../../constants";

interface ConfigurationCreateParameters {
    zeplin: {
        resource: {
            id: string;
            type: ResourceType;
        };
        workspaceId: string;
        events: WebhookEventType[];
    };
    microsoftTeams: {
        channel: {
            id: string;
            name: string;
        };
        incomingWebhookUrl: string;
        tenantId: string;
    };
}

interface ConfigurationUpdateParameters {
    configurationId: string;
    zeplin: {
        resource: {
            id: string;
            type: ResourceType;
        };
        workspaceId: string;
        events: WebhookEventType[];
    };
}

export const createConfiguration = async (
    {
        zeplin: {
            resource,
            events,
            workspaceId
        },
        ...configuration
    }: ConfigurationCreateParameters
): Promise<string> => {
    const { id } = await httpClient.post(
        "/api/configurations",
        {
            ...configuration,
            zeplin: {
                resource,
                workspaceId,
                events: events
                    .filter(webhookEventType => resourceBasedEvents[resource.type].includes(webhookEventType))
                    .map(webhookEventType => `${resource.type.toLowerCase()}.${webhookEventType}`)
            }
        }
    );
    return id;
};

export const updateConfiguration = async (
    {
        configurationId,
        zeplin: {
            resource,
            workspaceId,
            events
        }
    }: ConfigurationUpdateParameters
): Promise<void> => {
    await httpClient.put(
        `/api/configurations/${configurationId}`,
        {
            zeplin: {
                resource,
                workspaceId,
                events: events
                    .filter(webhookEventType => resourceBasedEvents[resource.type].includes(webhookEventType))
                    .map(webhookEventType => `${resource.type.toLowerCase()}.${webhookEventType}`)
            }
        }
    );
};

export const deleteConfiguration = async (configurationId: string): Promise<void> => {
    await httpClient.delete(`/api/configurations/${configurationId}`);
};

export const getConfiguration = async (configurationId: string): Promise<Configuration> => {
    const {
        zeplin: {
            resource: {
                id,
                name,
                type
            },
            workspaceId,
            webhook: {
                events
            }
        }
    } = await httpClient.get(`/api/configurations/${configurationId}`);

    return {
        resource: {
            id,
            name,
            type
        },
        workspaceId,
        webhook: {
            events: events.map((event: string) => event.slice(event.indexOf(".") + 1))
        }
    };
};

