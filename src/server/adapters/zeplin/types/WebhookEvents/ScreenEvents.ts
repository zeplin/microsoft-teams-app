import { WebhookEventType } from "./WebhookEventTypes";
import { ProjectContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { BaseWebhookEvent } from "./BaseWebhookEvent";
import { Screen } from "../Screen";

type BaseScreenEvent<A extends string, R extends object | undefined> = BaseWebhookEvent<
    WebhookEventType.PROJECT_SCREEN,
    A,
    ProjectContext,
    WebhookEventResourceType.SCREEN,
    R
>;

export type ScreenCreateEvent = BaseScreenEvent<"created", Screen>;
export type ScreenUpdateEvent = BaseScreenEvent<"updated", Screen>;
export type ScreenDeleteEvent = BaseScreenEvent<"deleted", undefined>;
export type ScreenEvent = (
    ScreenCreateEvent |
    ScreenUpdateEvent |
    ScreenDeleteEvent
);

