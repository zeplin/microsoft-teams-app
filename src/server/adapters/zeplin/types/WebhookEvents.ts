import { User } from "./User";
import {
    ColorResource,
    ComponentResource,
    NoteCommentResource,
    NoteResource,
    ProjectMemberResource,
    ScreenResource,
    ScreenVersionResource,
    SpacingTokenResource,
    StyleguideMemberResource,
    TextStyleResource,
    WebhookEventResource
} from "./WebhookEventResources";
import { WebhookEventType } from "./WebhookEventTypes";
import { NoteContext, ProjectContext, ScreenContext, StyleguideContext } from "./WebhookEventContexts";

type BaseWebhookEvent<
    E extends WebhookEventType = WebhookEventType,
    A extends string = string,
    C extends ProjectContext | StyleguideContext = ProjectContext | StyleguideContext,
    R extends WebhookEventResource = WebhookEventResource,
    > = {
    webhookId: string;
    deliveryId: string;
    payload: {
        event: E;
        action: A;
        timestamp: number;
        context: C;
        resource: R;
        actor: {
            user: User;
        };
    };
};

export type WebhookEvent = BaseWebhookEvent;
export type ProjectColorEvent = BaseWebhookEvent<
    WebhookEventType.PROJECT_COLOR,
    "created" | "updated",
    ProjectContext,
    ColorResource
>;
export type ProjectComponentEvent = BaseWebhookEvent<
    WebhookEventType.PROJECT_COMPONENT,
    "created" | "version_created",
    ProjectContext,
    ComponentResource
>;
export type ProjectMemberEvent = BaseWebhookEvent<
    WebhookEventType.PROJECT_MEMBER,
    "invited",
    ProjectContext,
    ProjectMemberResource
>;
export type ProjectNoteCommentEvent = BaseWebhookEvent<
    WebhookEventType.PROJECT_NOTE_COMMENT,
    "created",
    ProjectContext & ScreenContext & NoteContext,
    NoteCommentResource
>;
export type ProjectNoteEvent = BaseWebhookEvent<
    WebhookEventType.PROJECT_NOTE,
    "created",
    ProjectContext & ScreenContext,
    NoteResource
>;
export type ProjectScreenEvent = BaseWebhookEvent<
    WebhookEventType.PROJECT_SCREEN,
    "created",
    ProjectContext,
    ScreenResource
>;
export type ProjectScreenVersionEvent = BaseWebhookEvent<
    WebhookEventType.PROJECT_SCREEN_VERSION,
    "created",
    ProjectContext & ScreenContext,
    ScreenVersionResource
>;
export type ProjectSpacingTokenEvent = BaseWebhookEvent<
    WebhookEventType.PROJECT_SPACING_TOKEN,
    "created" | "updated",
    ProjectContext,
    SpacingTokenResource
>;
export type ProjectTextStyleEvent = BaseWebhookEvent<
    WebhookEventType.PROJECT_TEXT_STYLE,
    "created" | "updated",
    ProjectContext,
    TextStyleResource
>;
export type StyleguideColorEvent = BaseWebhookEvent<
    WebhookEventType.STYLEGUIDE_COLOR,
    "created" | "updated",
    StyleguideContext,
    ColorResource
>;
export type StyleguideComponentEvent = BaseWebhookEvent<
    WebhookEventType.STYLEGUIDE_COMPONENT,
    "created" | "version_created",
    StyleguideContext,
    ComponentResource
>;
export type StyleguideMemberEvent = BaseWebhookEvent<
    WebhookEventType.STYLEGUIDE_MEMBER,
    "invited",
    StyleguideContext,
    StyleguideMemberResource
>;
export type StyleguideSpacingTokenEvent = BaseWebhookEvent<
    WebhookEventType.STYLEGUIDE_SPACING_TOKEN,
    "created" | "updated",
    StyleguideContext,
    SpacingTokenResource
>;
export type StyleguideTextStyleEvent = BaseWebhookEvent<
    WebhookEventType.STYLEGUIDE_TEXT_STYLE,
    "created" | "updated",
    StyleguideContext,
    TextStyleResource
>;
