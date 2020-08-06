type EventDescriptor = {
    type: string;
    action: string;
}

type Resource = {
    id: string;
    type: ResourceType;
    data?: object;
}

export interface ProjectContext {
    project: {
        id: string;
    };
}

export enum ResourceType {
    PROJECT = "Project",
    STYLEGUIDE = "Styleguide",
    COLOR = "Color",
    TEXT_STYLE = "TextStyle",
    COMPONENT = "Component",
    SPACING_TOKEN = "SpacingToken",
    PROJECT_MEMBER = "ProjectMember",
    STYLEGUIDE_MEMBER = "StyleguideMember",
    ORGANIZATION_SUMMARY = "OrganizationSummary",
    SCREEN = "Screen",
    SCREEN_VERSION = "ScreenVersion",
    ORGANIZATION_MEMBER = "OrganizationMember",
    SCREEN_NOTE = "ScreenNote",
    SCREEN_NOTE_COMMENT = "ScreenNoteComment"
}

export interface EventPayload<
    E extends EventDescriptor,
    C extends object | undefined,
    R extends Resource,
> {
    event: E["type"];
    action: E["action"];
    timestamp: number;
    context: C;
    resource: R;
    actor: {
        user: {
            id: string;
            email: string;
            username?: string;
            emotar?: string;
            avatar?: string;
        };
    };
}
export type CommonEventPayload = EventPayload<EventDescriptor, object | undefined, Resource>;
export type WebhookEvent<T extends CommonEventPayload = CommonEventPayload> = {
    webhookId: string;
    deliveryId: string;
    payload: T;
};
export type MessageJobData = {
    id: string;
    groupingKey: string;
}