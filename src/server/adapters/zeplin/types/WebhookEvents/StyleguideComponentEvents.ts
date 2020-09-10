import { WebhookEventType } from "./WebhookEventTypes";
import { ComponentVersionContext, StyleguideContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { Component } from "../Component";
import { BaseWebhookEvent } from "./BaseWebhookEvent";

type BaseStyleguideColorEvent<
    A extends string,
    R extends object | undefined,
    C extends StyleguideContext = StyleguideContext
> = BaseWebhookEvent<
    WebhookEventType.STYLEGUIDE_COMPONENT,
    A,
    StyleguideContext,
    WebhookEventResourceType.COMPONENT,
    R
>;

export type StyleguideComponentCreateEvent = BaseStyleguideColorEvent<"created", Component>;
export type StyleguideComponentUpdateEvent = BaseStyleguideColorEvent<"updated", Component>;
export type StyleguideComponentVersionCreateEvent = BaseStyleguideColorEvent<
    "version_created",
    Component,
    StyleguideContext & ComponentVersionContext
>;
export type StyleguideComponentDeleteEvent = BaseStyleguideColorEvent<"deleted", undefined>;

export type StyleguideComponentEvent = (
    StyleguideComponentCreateEvent |
    StyleguideComponentUpdateEvent |
    StyleguideComponentVersionCreateEvent |
    StyleguideComponentDeleteEvent
);
