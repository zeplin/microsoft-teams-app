import { WebhookEventType } from "./WebhookEventTypes";
import { ComponentVersionContext, ProjectContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { Component } from "../Component";
import { BaseWebhookEvent } from "./BaseWebhookEvent";

type BaseProjectComponentEvent<
    A extends string,
    R extends object | undefined,
    C extends ProjectContext = ProjectContext & ComponentVersionContext
> = BaseWebhookEvent<WebhookEventType.PROJECT_COMPONENT, A, C, WebhookEventResourceType.COMPONENT, R>;

export type ProjectComponentCreateEvent = BaseProjectComponentEvent<"created", Component>;
export type ProjectComponentUpdateEvent = BaseProjectComponentEvent<"updated", Component>;
export type ProjectComponentVersionCreateEvent = BaseProjectComponentEvent<"version_created", Component>;
export type ProjectComponentDeleteEvent = BaseProjectComponentEvent<"deleted", undefined, ProjectContext>;

export type ProjectComponentEvent = (
    ProjectComponentCreateEvent |
    ProjectComponentUpdateEvent |
    ProjectComponentVersionCreateEvent |
    ProjectComponentDeleteEvent
);
