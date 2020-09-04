export enum ProjectWebhookEventType {
    ALL = "project.*",
    COLOR = "project.color",
    COMPONENT = "project.component",
    MEMBER = "project.member",
    NOTE = "project.note",
    NOTE_COMMENT = "project.note.comment",
    SCREEN = "project.screen",
    SCREEN_VERSION = "project.screen.version",
    SPACING_TOKEN = "project.spacing_token",
    TEXT_STYLE = "project.text_style",
}

export enum StyleguideWebhookEventType {
    ALL = "styleguide.*",
    COLOR = "styleguide.color",
    COMPONENT = "styleguide.component",
    MEMBER = "styleguide.member",
    SPACING_TOKEN = "styleguide.spacing_token",
    TEXT_STYLE = "styleguide.text_style",
}

export enum WebhookEventType {
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

