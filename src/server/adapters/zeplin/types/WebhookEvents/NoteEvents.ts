import { WebhookEventType } from "./WebhookEventTypes";
import { ProjectContext, ScreenContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { BaseWebhookEvent } from "./BaseWebhookEvent";
import { Note } from "../Note";

type BaseNoteEvent<A extends string, R extends object | undefined> = BaseWebhookEvent<
    WebhookEventType.PROJECT_NOTE,
    A,
    ProjectContext & ScreenContext,
    WebhookEventResourceType.SCREEN_NOTE,
    R
>;

export type NoteCreateEvent = BaseNoteEvent<"created", Note>;
export type NoteUpdateEvent = BaseNoteEvent<"updated", Note>;
export type NoteDeleteEvent = BaseNoteEvent<"deleted", undefined>;
export type NoteEvent = (
    NoteCreateEvent |
    NoteUpdateEvent |
    NoteDeleteEvent
);
