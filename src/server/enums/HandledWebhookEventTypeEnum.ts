export enum HandledWebhookEventTypeEnum {
    PING = "ping",
    PROJECT_COLOR = "project.color",
    PROJECT_NOTE = "project.note",
    PROJECT_NOTE_COMMENT = "project.note.comment",
    PROJECT_SPACING_TOKEN = "project.spacing_token",
    PROJECT_TEXT_STYLE = "project.text_style",
    PROJECT_MEMBER = "project.member",
    PROJECT_COMPONENT = "project.component",
    PROJECT_SCREEN = "project.screen",
    PROJECT_SCREEN_VERSION = "project.screen.version",
    STYLEGUIDE_COLOR = "styleguide.color",
    STYLEGUIDE_TEXT_STYLE = "styleguide.text_style",
    STYLEGUIDE_SPACING_TOKEN = "styleguide.spacing_token",
    STYLEGUIDE_MEMBER = "styleguide.member",
    STYLEGUIDE_COMPONENT = "styleguide.component",
}

export function isHandledWebhookEventTypeEnum(value: string): value is HandledWebhookEventTypeEnum {
    return Object.values<string>(HandledWebhookEventTypeEnum).includes(value);
}
