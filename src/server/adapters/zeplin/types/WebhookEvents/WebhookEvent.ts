import { WebhookEventType } from "./WebhookEventTypes";
import { ProjectContext, StyleguideContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { BaseWebhookEvent } from "./BaseWebhookEvent";
import { PingEvent } from "./PingEvent";

export type WebhookEvent = BaseWebhookEvent<
    WebhookEventType,
    string,
    ProjectContext | StyleguideContext,
    WebhookEventResourceType,
    object | undefined
> | PingEvent;
