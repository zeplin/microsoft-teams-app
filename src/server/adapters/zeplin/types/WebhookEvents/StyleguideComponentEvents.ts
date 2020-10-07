import { WebhookEventType } from "./WebhookEventTypes";
import { ComponentVersionContext, StyleguideContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { Component } from "../Component";
import { BaseWebhookEvent } from "./BaseWebhookEvent";

type BaseStyleguideComponentEvent<
    A extends string,
    R extends object | undefined,
    C extends StyleguideContext = StyleguideContext & ComponentVersionContext
> = BaseWebhookEvent<WebhookEventType.STYLEGUIDE_COMPONENT, A, C, WebhookEventResourceType.COMPONENT, R>;

export type StyleguideComponentCreateEvent = BaseStyleguideComponentEvent<"created", Component>;
export type StyleguideComponentUpdateEvent = BaseStyleguideComponentEvent<"updated", Component>;
export type StyleguideComponentVersionCreateEvent = BaseStyleguideComponentEvent<"version_created", Component>;
export type StyleguideComponentDeleteEvent = BaseStyleguideComponentEvent<"deleted", undefined, StyleguideContext>;

export type StyleguideComponentEvent = (
    StyleguideComponentCreateEvent |
    StyleguideComponentUpdateEvent |
    StyleguideComponentVersionCreateEvent |
    StyleguideComponentDeleteEvent
);
