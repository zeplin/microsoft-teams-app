import { OrganizationSummary } from "./organizationSummary";
import { RemPreferences } from "./remPreferences";

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
    PROJECT_COLOR = "project.color",
    STYLEGUIDE_COLOR = "styleguide.color",
    PROJECT_NOTE = "project.note"
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
    screen: {
        id: string;
        created: number;
        updated?: number;
        tags: string[];
        name: string;
        image: {
            width: number;
            height: number;
            original_url?: string;
        };
        section?: {
            id: string;
        };
        description?: string;
        number_of_versions: number;
        number_of_notes: number;
    };
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