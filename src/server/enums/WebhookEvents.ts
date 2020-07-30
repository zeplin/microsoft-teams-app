export enum ProjectWebhookEvent {
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

export enum StyleguideWebhookEvent {
    ALL = "styleguide.*",
    COLOR = "styleguide.color",
    COMPONENT = "styleguide.component",
    MEMBER = "styleguide.member",
    SPACING_TOKEN = "styleguide.spacing_token",
    TEXT_STYLE = "styleguide.text_style",
}
