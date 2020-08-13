import { projectColorNotificationHandler } from "./projectColorNotificationHandler";
import { NotificationHandler } from "./NotificationHandler";
import { EventType } from "../../messagingTypes";
import { styleguideColorNotificationHandler } from "./styleguideColorNotificationHandler";
import { projectNoteNotificationHandler } from "./projectNoteNotificationHandler";
import { projectNoteCommentNotificationHandler } from "./projectNoteReplyNotificationHandler";

const notificationMap: Record<EventType, NotificationHandler> = {
    [EventType.PROJECT_COLOR]: projectColorNotificationHandler,
    [EventType.STYLEGUIDE_COLOR]: styleguideColorNotificationHandler,
    [EventType.PROJECT_NOTE]: projectNoteNotificationHandler,
    [EventType.PROJECT_NOTE_COMMENT]: projectNoteCommentNotificationHandler
} as const;

export function getNotificationHandler(eventType: EventType): NotificationHandler {
    return notificationMap[eventType];
}