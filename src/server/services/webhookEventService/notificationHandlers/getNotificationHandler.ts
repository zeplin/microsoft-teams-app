import { projectColorNotificationHandler } from "./projectColorNotificationHandler";
import { NotificationHandler } from "./NotificationHandler";
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
import { projectScreenNotificationHandler } from "./projectScreenNotificationHandler";
import { projectScreenVersionNotificationHandler } from "./projectScreenVersionNotificationHandler";
import { pingNotificationHandler } from "./pingNotificationHandler";
import { WebhookEvent, WebhookEventType } from "../../../adapters/zeplin/types";

const notificationMap: Record<WebhookEventType, NotificationHandler<WebhookEvent>> = {
    [WebhookEventType.PING]: pingNotificationHandler,
    [WebhookEventType.PROJECT_COLOR]: projectColorNotificationHandler,
    [WebhookEventType.STYLEGUIDE_COLOR]: styleguideColorNotificationHandler,
    [WebhookEventType.PROJECT_NOTE]: projectNoteNotificationHandler,
    [WebhookEventType.PROJECT_NOTE_COMMENT]: projectNoteCommentNotificationHandler,
    [WebhookEventType.PROJECT_TEXT_STYLE]: projectTextStyleNotificationHandler,
    [WebhookEventType.STYLEGUIDE_TEXT_STYLE]: styleguideTextStyleNotificationHandler,
    [WebhookEventType.PROJECT_SPACING_TOKEN]: projectSpacingTokenNotificationHandler,
    [WebhookEventType.STYLEGUIDE_SPACING_TOKEN]: styleguideSpacingTokenNotificationHandler,
    [WebhookEventType.PROJECT_MEMBER]: projectMemberNotificationHandler,
    [WebhookEventType.STYLEGUIDE_MEMBER]: styleguideMemberNotificationHandler,
    [WebhookEventType.PROJECT_COMPONENT]: projectComponentNotificationHandler,
    [WebhookEventType.STYLEGUIDE_COMPONENT]: styleguideComponentNotificationHandler,
    [WebhookEventType.PROJECT_SCREEN]: projectScreenNotificationHandler,
    [WebhookEventType.PROJECT_SCREEN_VERSION]: projectScreenVersionNotificationHandler
} as const;

export function getNotificationHandler(eventType: WebhookEventType): NotificationHandler<WebhookEvent> {
    return notificationMap[eventType];
}
