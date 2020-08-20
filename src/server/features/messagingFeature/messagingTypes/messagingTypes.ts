import { OrganizationSummary } from "./organizationSummary";
import { RemPreferences } from "./remPreferences";
import { ScreenNoteResource } from "../messageFacade/messageFacadeNotificationHandlers/resources";
import { ScreenResource } from "../messageFacade/messageFacadeNotificationHandlers/resources/screenResource";

type EventDescriptor = {
    type: EventType;
    action: string;
}

type Resource = {
    id: string;
    type: ResourceType;
    data?: object;
}

export enum EventType {
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

export interface ProjectContext {
    project: {
        id: string;
        created: number;
        name: string;
        description?: string;
        thumbnail?: string;
        platform: "android" | "ios" | "web" | "macos";
        status: "active" | "archived" | "deleted";
        organization?: OrganizationSummary;
        scene_url?: string;
        updated?: number;
        rem_preferences?: RemPreferences;
        number_of_screens: number;
        number_of_components: number;
        number_of_text_styles: number;
        number_of_colors: number;
        number_of_spacing_tokens: number;
        number_of_members: number;
        linked_styleguide?: {
            id: string;
        };
    };
}

export interface ScreenContext {
    screen: ScreenResource["data"];
}

export interface NoteContext {
    note: ScreenNoteResource["data"];
}

export interface StyleguideContext {
    styleguide: {
        id: string;
        created: number;
        name: string;
        description?: string;
        thumbnail?: string;
        platform: "base" | "web" | "ios" | "android" | "macos";
        status: "active" | "archived" | "deleted";
        organization?: OrganizationSummary;
        updated?: number;
        rem_preferences?: RemPreferences;
        number_of_components: number;
        number_of_text_styles: number;
        number_of_colors: number;
        number_of_spacing_tokens: number;
        number_of_members: number;
        parent?: {
            id: string;
        };
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

export type User = {
    id: string;
    email: string;
    username: string;
    emotar?: string;
    avatar?: string;
}

export interface EventPayload<
    E extends EventDescriptor,
    C extends ProjectContext | StyleguideContext,
    R extends Resource,
> {
    event: E["type"];
    action: E["action"];
    timestamp: number;
    context: C;
    resource: R;
    actor: {
        user: User;
    };
}

export type CommonEventPayload = EventPayload<EventDescriptor, ProjectContext | StyleguideContext, Resource>;

export type WebhookEvent<T extends CommonEventPayload = CommonEventPayload> = {
    webhookId: string;
    deliveryId: string;
    payload: T;
};

export type MessageJobData = {
    id: string;
    groupingKey: string;
}
