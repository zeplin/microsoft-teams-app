import { WebhookEventType } from "./WebhookEventTypes";
import { ProjectContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { BaseWebhookEvent } from "./BaseWebhookEvent";
import { TextStyle } from "../TextStyle";

type BaseProjectTextStyleEvent<A extends string, R extends object | undefined> = BaseWebhookEvent<
    WebhookEventType.PROJECT_TEXT_STYLE,
    A,
    ProjectContext,
    WebhookEventResourceType.TEXT_STYLE,
    R
>;

export type ProjectTextStyleCreateEvent = BaseProjectTextStyleEvent<"created", TextStyle>;
export type ProjectTextStyleUpdateEvent = BaseProjectTextStyleEvent<"updated", TextStyle>;
export type ProjectTextStyleDeleteEvent = BaseProjectTextStyleEvent<"deleted", undefined>;
export type ProjectTextStyleEvent = (
    ProjectTextStyleCreateEvent |
    ProjectTextStyleUpdateEvent |
    ProjectTextStyleDeleteEvent
);

