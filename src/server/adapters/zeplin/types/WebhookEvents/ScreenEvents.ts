import { WebhookEventType } from "./WebhookEventTypes";
import { ScreenVersionContext, ProjectContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { BaseWebhookEvent } from "./BaseWebhookEvent";
import { Screen } from "../Screen";

type BaseScreenEvent<
    A extends string,
    R extends object | undefined,
    C extends ProjectContext = ProjectContext & ScreenVersionContext
> = BaseWebhookEvent<WebhookEventType.PROJECT_SCREEN, A, C, WebhookEventResourceType.SCREEN, R>;

export type ScreenCreateEvent = BaseScreenEvent<"created", Screen>;
export type ScreenUpdateEvent = BaseScreenEvent<"updated", Screen>;
export type ScreenDeleteEvent = BaseScreenEvent<"deleted", undefined, ProjectContext>;
export type ScreenEvent = (
    ScreenCreateEvent |
    ScreenUpdateEvent |
    ScreenDeleteEvent
);

