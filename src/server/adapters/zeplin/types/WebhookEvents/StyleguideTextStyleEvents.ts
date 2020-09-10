import { WebhookEventType } from "./WebhookEventTypes";
import { StyleguideContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { BaseWebhookEvent } from "./BaseWebhookEvent";
import { TextStyle } from "../TextStyle";

type BaseStyleguideTextStyleEvent<A extends string, R extends object | undefined> = BaseWebhookEvent<
    WebhookEventType.STYLEGUIDE_TEXT_STYLE,
    A,
    StyleguideContext,
    WebhookEventResourceType.TEXT_STYLE,
    R
>;

export type StyleguideTextStyleCreateEvent = BaseStyleguideTextStyleEvent<"created", TextStyle>;
export type StyleguideTextStyleUpdateEvent = BaseStyleguideTextStyleEvent<"updated", TextStyle>;
export type StyleguideTextStyleDeleteEvent = BaseStyleguideTextStyleEvent<"deleted", undefined>;
export type StyleguideTextStyleEvent = (
    StyleguideTextStyleCreateEvent |
    StyleguideTextStyleUpdateEvent |
    StyleguideTextStyleDeleteEvent
);

