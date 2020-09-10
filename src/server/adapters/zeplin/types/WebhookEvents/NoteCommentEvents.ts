import { WebhookEventType } from "./WebhookEventTypes";
import { NoteContext, ProjectContext, ScreenContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";
import { NoteComment } from "../NoteComment";
import { BaseWebhookEvent } from "./BaseWebhookEvent";

type BaseNoteCommentEvent<A extends string, R extends object | undefined> = BaseWebhookEvent<
    WebhookEventType.PROJECT_NOTE_COMMENT,
    A,
    ProjectContext & ScreenContext & NoteContext,
    WebhookEventResourceType.SCREEN_NOTE_COMMENT,
    R
>;

export type NoteCommentCreateEvent = BaseNoteCommentEvent<"created", NoteComment>;
export type NoteCommentUpdateEvent = BaseNoteCommentEvent<"updated", NoteComment>;
export type NoteCommentDeleteEvent = BaseNoteCommentEvent<"deleted", undefined>;
export type NoteCommentEvent = (
    NoteCommentCreateEvent |
    NoteCommentUpdateEvent |
    NoteCommentDeleteEvent
);
