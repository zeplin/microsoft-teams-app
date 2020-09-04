import { WebhookEventType } from "./WebhookEventTypes";
import { ProjectContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { Color } from "../Color";
import { BaseWebhookEvent } from "./BaseWebhookEvent";

type BaseProjectColorEvent<A extends string, R extends object | undefined> = BaseWebhookEvent<
    WebhookEventType.PROJECT_COLOR,
    A,
    ProjectContext,
    WebhookEventResourceType.COLOR,
    R
>;

export type ProjectColorCreateEvent = BaseProjectColorEvent<"created", Color>;
export type ProjectColorUpdateEvent = BaseProjectColorEvent<"updated", Color>;
export type ProjectColorDeleteEvent = BaseProjectColorEvent<"deleted", undefined>;

export type ProjectColorEvent = ProjectColorCreateEvent | ProjectColorUpdateEvent | ProjectColorDeleteEvent;
