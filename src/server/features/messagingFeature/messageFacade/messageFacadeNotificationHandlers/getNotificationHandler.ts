import { projectColorNotificationHandler } from "./projectColorNotificationHandler";
import { NotificationHandler } from "./NotificationHandler";
import { EventType } from "../../messagingTypes";
import { styleguideColorNotificationHandler } from "./styleguideColorNotificationHandler";
import { projectNoteNotificationHandler } from "./projectNoteNotificationHandler";
import { projectNoteCommentNotificationHandler } from "./projectNoteCommentNotificationHandler";
import { projectTextStyleNotificationHandler } from "./projectTextStyleNotificationHandler";
import { styleguideTextStyleNotificationHandler } from "./styleguideTextStyleNotificationHandler";
import { projectSpacingTokenNotificationHandler } from "./projectSpacingTokenNotificationHandler";
import { styleguideSpacingTokenNotificationHandler } from "./styleguideSpacingTokenNotificationHandler";
import { projectMemberNotificationHandler } from "./projectMemberNotificationHandler";
import { styleguideMemberNotificationHandler } from "./styleguideMemberNotificationHandler";
import { projectComponentNotificationHandler } from "./projectComponentNotificationHandler";
import { styleguideComponentNotificationHandler } from "./styleguideComponentNotificationHandler";

const notificationMap: Record<EventType, NotificationHandler> = {
    [EventType.PROJECT_COLOR]: projectColorNotificationHandler,
    [EventType.STYLEGUIDE_COLOR]: styleguideColorNotificationHandler,
    [EventType.PROJECT_NOTE]: projectNoteNotificationHandler,
    [EventType.PROJECT_NOTE_COMMENT]: projectNoteCommentNotificationHandler,
    [EventType.PROJECT_TEXT_STYLE]: projectTextStyleNotificationHandler,
    [EventType.STYLEGUIDE_TEXT_STYLE]: styleguideTextStyleNotificationHandler,
    [EventType.PROJECT_SPACING_TOKEN]: projectSpacingTokenNotificationHandler,
    [EventType.STYLEGUIDE_SPACING_TOKEN]: styleguideSpacingTokenNotificationHandler,
    [EventType.PROJECT_MEMBER]: projectMemberNotificationHandler,
    [EventType.STYLEGUIDE_MEMBER]: styleguideMemberNotificationHandler,
    [EventType.PROJECT_COMPONENT]: projectComponentNotificationHandler,
    [EventType.STYLEGUIDE_COMPONENT]: styleguideComponentNotificationHandler
} as const;

export function getNotificationHandler(eventType: EventType): NotificationHandler {
    return notificationMap[eventType];
}