
export enum ResourceType {
    PROJECT = "project",
    STYLEGUIDE = "styleguide"
}

export interface Resource {
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
    channelId: string;
    channelName: string;
    tenantId: string;
    webhookUrl: string;
    workspace: string;
    resource: Resource;
    webhookEvents: WebhookEventType[];
}

export const createConfiguration = ({
    resource,
    webhookEvents,
    ...configuration
}: ConfigurationCreateParameters): Promise<string> => {
    // eslint-disable-next-line no-console
    console.log({
        ...configuration,
        resource,
        webhookEvents: webhookEvents
            .filter(webhookEventType => resourceBasedEvents[resource.type].includes(webhookEventType))
            .map(webhookEventType => `${resource.type}.${webhookEventType}`)
    });
    return Promise.resolve("hello world");
};

