import { WebhookEventType } from "./WebhookEventTypes";
import { ProjectContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { BaseWebhookEvent } from "./BaseWebhookEvent";
import { SpacingToken } from "../SpacingToken";

type BaseProjectSpacingTokenEvent<A extends string, R extends object | undefined> = BaseWebhookEvent<
    WebhookEventType.PROJECT_SPACING_TOKEN,
    A,
    ProjectContext,
    WebhookEventResourceType.SPACING_TOKEN,
    R
>;

export type ProjectSpacingTokenCreateEvent = BaseProjectSpacingTokenEvent<"created", SpacingToken>;
export type ProjectSpacingTokenUpdateEvent = BaseProjectSpacingTokenEvent<"updated", SpacingToken>;
export type ProjectSpacingTokenDeleteEvent = BaseProjectSpacingTokenEvent<"deleted", undefined>;
export type ProjectSpacingTokenEvent = (
    ProjectSpacingTokenCreateEvent |
    ProjectSpacingTokenUpdateEvent |
    ProjectSpacingTokenDeleteEvent
);

