import Axios from "axios";

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
    accessToken: string;
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
        accessToken,
        zeplin: {
            resource,
            events
        },
        ...configuration
    }: ConfigurationCreateParameters
): Promise<string> => {
    const { data: { id } } = await Axios.post(
        "/api/configurations",
        {
            ...configuration,
            zeplin: {
                resource,
                events: events
                    .filter(webhookEventType => resourceBasedEvents[resource.type].includes(webhookEventType))
                    .map(webhookEventType => `${resource.type.toLowerCase()}.${webhookEventType}`)
            }
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
    return id;
};

export interface ConfigurationUpdateParameters {
    accessToken: string;
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
        accessToken,
        configurationId,
        zeplin: {
            resource,
            events
        }
    }: ConfigurationUpdateParameters
): Promise<string> => {
    const { data: { id } } = await Axios.put(
        `/api/configurations/${configurationId}`,
        {
            zeplin: {
                resource,
                events: events
                    .filter(webhookEventType => resourceBasedEvents[resource.type].includes(webhookEventType))
                    .map(webhookEventType => `${resource.type.toLowerCase()}.${webhookEventType}`)
            }
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
    return id;
};

export interface ConfigurationDeleteParameters {
    accessToken: string;
    configurationId: string;
}

export const fetchConfigurationDelete = async (
    {
        accessToken,
        configurationId
    }: ConfigurationDeleteParameters
): Promise<void> => {
    await Axios.delete(
        `/api/configurations/${configurationId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
};

export interface ConfigurationParameters {
    accessToken: string;
    configurationId: string;
}

export interface Configuration {
    resource: Resource;
    webhook: {
        events: WebhookEventType[];
    };
}

export const fetchConfiguration = async (
    {
        accessToken,
        configurationId
    }: ConfigurationParameters
): Promise<Configuration> => {
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
    } = await Axios.get(
        `/api/configurations/${configurationId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

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

