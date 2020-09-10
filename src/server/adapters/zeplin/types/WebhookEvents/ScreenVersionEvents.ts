import { WebhookEventType } from "./WebhookEventTypes";
import { ProjectContext, ScreenContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { BaseWebhookEvent } from "./BaseWebhookEvent";
import { ScreenVersionSummary } from "../ScreenVersionSummary";

type BaseScreenVersionEvent<A extends string, R extends object | undefined> = BaseWebhookEvent<
    WebhookEventType.PROJECT_SCREEN_VERSION,
    A,
    ProjectContext & ScreenContext,
    WebhookEventResourceType.SCREEN_VERSION,
    R
>;

export type ScreenVersionCreateEvent = BaseScreenVersionEvent<"created", ScreenVersionSummary>;
export type ScreenVersionUpdateEvent = BaseScreenVersionEvent<"updated", ScreenVersionSummary>;
export type ScreenVersionDeleteEvent = BaseScreenVersionEvent<"deleted", undefined>;
export type ScreenVersionEvent = (
    ScreenVersionCreateEvent |
    ScreenVersionUpdateEvent |
    ScreenVersionDeleteEvent
);

