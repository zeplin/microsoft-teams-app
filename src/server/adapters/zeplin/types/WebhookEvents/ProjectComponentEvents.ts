import { WebhookEventType } from "./WebhookEventTypes";
import { ComponentVersionContext, ProjectContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { Component } from "../Component";
import { BaseWebhookEvent } from "./BaseWebhookEvent";

type BaseProjectColorEvent<
    A extends string,
    R extends object | undefined,
    C extends ProjectContext = ProjectContext
> = BaseWebhookEvent<
    WebhookEventType.PROJECT_COMPONENT,
    A,
    ProjectContext,
    WebhookEventResourceType.COMPONENT,
    R
>;

export type ProjectComponentCreateEvent = BaseProjectColorEvent<"created", Component>;
export type ProjectComponentUpdateEvent = BaseProjectColorEvent<"updated", Component>;
export type ProjectComponentVersionCreateEvent = BaseProjectColorEvent<
    "version_created",
    Component,
    ProjectContext & ComponentVersionContext
>;
export type ProjectComponentDeleteEvent = BaseProjectColorEvent<"deleted", undefined>;

export type ProjectComponentEvent = (
    ProjectComponentCreateEvent |
    ProjectComponentUpdateEvent |
    ProjectComponentVersionCreateEvent |
    ProjectComponentDeleteEvent
);
