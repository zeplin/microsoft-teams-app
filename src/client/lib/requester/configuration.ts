import { client } from "./client";

export enum ResourceType {
    PROJECT = "Project",
    STYLEGUIDE = "Styleguide"
}

export interface Resource {
    name: string;
    type: ResourceType;
    id: string;
}

export enum WebhookEventType {
    SCREEN = "screen",
    SCREEN_VERSION = "screen.version",
    COMPONENT = "component",
    COLOR = "color",
    TEXT_STYLE = "text_style",
    SPACING_TOKEN = "spacing_token",
    NOTE = "note",
    NOTE_COMMENT = "note.comment",
    MEMBER = "member",
}

export const resourceBasedEvents = {
    [ResourceType.PROJECT]: [
        WebhookEventType.SCREEN,
        WebhookEventType.SCREEN_VERSION,
        WebhookEventType.COMPONENT,
        WebhookEventType.COLOR,
        WebhookEventType.TEXT_STYLE,
        WebhookEventType.SPACING_TOKEN,
        WebhookEventType.NOTE,
        WebhookEventType.NOTE_COMMENT,
        WebhookEventType.MEMBER
    ],
    [ResourceType.STYLEGUIDE]: [
        WebhookEventType.COMPONENT,
        WebhookEventType.COLOR,
        WebhookEventType.TEXT_STYLE,
        WebhookEventType.SPACING_TOKEN,
        WebhookEventType.MEMBER
    ]
};

export interface ConfigurationCreateParameters {
    zeplin: {
        resource: {
            id: string;
            type: ResourceType;
        };
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

export const fetchConfigurationCreate = async (
    {
        zeplin: {
            resource,
            events
        },
        ...configuration
    }: ConfigurationCreateParameters
): Promise<string> => {
    const { data: { id } } = await client.post(
        "/api/configurations",
        {
            ...configuration,
            zeplin: {
                resource,
                events: events
                    .filter(webhookEventType => resourceBasedEvents[resource.type].includes(webhookEventType))
                    .map(webhookEventType => `${resource.type.toLowerCase()}.${webhookEventType}`)
            }
        }
    );
    return id;
};

export interface ConfigurationUpdateParameters {
    configurationId: string;
    zeplin: {
        resource: {
            id: string;
            type: ResourceType;
        };
        events: WebhookEventType[];
    };
}

export const fetchConfigurationUpdate = async (
    {
        configurationId,
        zeplin: {
            resource,
            events
        }
    }: ConfigurationUpdateParameters
): Promise<string> => {
    const { data: { id } } = await client.put(
        `/api/configurations/${configurationId}`,
        {
            zeplin: {
                resource,
                events: events
                    .filter(webhookEventType => resourceBasedEvents[resource.type].includes(webhookEventType))
                    .map(webhookEventType => `${resource.type.toLowerCase()}.${webhookEventType}`)
            }
        }
    );
    return id;
};

export const fetchConfigurationDelete = async (configurationId: string): Promise<void> => {
    await client.delete(`/api/configurations/${configurationId}`);
};

export interface Configuration {
    resource: Resource;
    webhook: {
        events: WebhookEventType[];
    };
}

export const fetchConfiguration = async (configurationId: string): Promise<Configuration> => {
    const {
        data: {
            zeplin: {
                resource: {
                    id,
                    name,
                    type
                },
                webhook: {
                    events
                }
            }
        }
    } = await client.get(`/api/configurations/${configurationId}`);

    return {
        resource: {
            id,
            name,
            type
        },
        webhook: {
            events: events.map(event => event.slice(event.indexOf(".") + 1))
        }
    };
};

