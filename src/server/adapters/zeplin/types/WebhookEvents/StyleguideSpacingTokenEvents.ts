import { WebhookEventType } from "./WebhookEventTypes";
import { StyleguideContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { BaseWebhookEvent } from "./BaseWebhookEvent";
import { SpacingToken } from "../SpacingToken";

type BaseStyleguideSpacingTokenEvent<A extends string, R extends object | undefined> = BaseWebhookEvent<
    WebhookEventType.STYLEGUIDE_SPACING_TOKEN,
    A,
    StyleguideContext,
    WebhookEventResourceType.SPACING_TOKEN,
    R
>;

export type StyleguideSpacingTokenCreateEvent = BaseStyleguideSpacingTokenEvent<"created", SpacingToken>;
export type StyleguideSpacingTokenUpdateEvent = BaseStyleguideSpacingTokenEvent<"updated", SpacingToken>;
export type StyleguideSpacingTokenDeleteEvent = BaseStyleguideSpacingTokenEvent<"deleted", undefined>;
export type StyleguideSpacingTokenEvent = (
    StyleguideSpacingTokenCreateEvent |
    StyleguideSpacingTokenUpdateEvent |
    StyleguideSpacingTokenDeleteEvent
);

