import { WebhookEventType } from "./WebhookEventTypes";
import { StyleguideContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { Color } from "../Color";
import { BaseWebhookEvent } from "./BaseWebhookEvent";

type BaseStyleguideColorEvent<A extends string, R extends object | undefined> = BaseWebhookEvent<
    WebhookEventType.STYLEGUIDE_COLOR,
    A,
    StyleguideContext,
    WebhookEventResourceType.COLOR,
    R
>;

export type StyleguideColorCreateEvent = BaseStyleguideColorEvent<"created", Color>;
export type StyleguideColorUpdateEvent = BaseStyleguideColorEvent<"updated", Color>;
export type StyleguideColorDeleteEvent = BaseStyleguideColorEvent<"deleted", undefined>;

export type StyleguideColorEvent = StyleguideColorCreateEvent | StyleguideColorUpdateEvent | StyleguideColorDeleteEvent;
