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

export interface ConfigurationConstants {
    resource: Resource;
    webhook: {
        events: WebhookEventType[];
    };
}
