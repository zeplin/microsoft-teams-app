import { projectColorHandler } from "./projectColorHandler";
import { NotificationHandler } from "./NotificationHandler";
import { styleguideColorHandler } from "./styleguideColorHandler";
import { projectNoteHandler } from "./projectNoteHandler";
import { projectNoteCommentHandler } from "./projectNoteCommentHandler";
import { projectTextStyleHandler } from "./projectTextStyleHandler";
import { styleguideTextStyleHandler } from "./styleguideTextStyleHandler";
import { projectSpacingTokenHandler } from "./projectSpacingTokenHandler";
import { styleguideSpacingTokenHandler } from "./styleguideSpacingTokenHandler";
import { projectMemberHandler } from "./projectMemberHandler";
import { styleguideMemberHandler } from "./styleguideMemberHandler";
import { projectComponentHandler } from "./projectComponentHandler";
import { styleguideComponentHandler } from "./styleguideComponentHandler";
import { projectScreenHandler } from "./projectScreenHandler";
import { projectScreenVersionHandler } from "./projectScreenVersionHandler";
import { pingHandler } from "./pingHandler";
import { WebhookEvent, WebhookEventType } from "../../../adapters/zeplin/types";

const notificationMap: Record<WebhookEventType, NotificationHandler<WebhookEvent>> = {
    [WebhookEventType.PING]: pingHandler,
    [WebhookEventType.PROJECT_COLOR]: projectColorHandler,
    [WebhookEventType.STYLEGUIDE_COLOR]: styleguideColorHandler,
    [WebhookEventType.PROJECT_NOTE]: projectNoteHandler,
    [WebhookEventType.PROJECT_NOTE_COMMENT]: projectNoteCommentHandler,
    [WebhookEventType.PROJECT_TEXT_STYLE]: projectTextStyleHandler,
    [WebhookEventType.STYLEGUIDE_TEXT_STYLE]: styleguideTextStyleHandler,
    [WebhookEventType.PROJECT_SPACING_TOKEN]: projectSpacingTokenHandler,
    [WebhookEventType.STYLEGUIDE_SPACING_TOKEN]: styleguideSpacingTokenHandler,
    [WebhookEventType.PROJECT_MEMBER]: projectMemberHandler,
    [WebhookEventType.STYLEGUIDE_MEMBER]: styleguideMemberHandler,
    [WebhookEventType.PROJECT_COMPONENT]: projectComponentHandler,
    [WebhookEventType.STYLEGUIDE_COMPONENT]: styleguideComponentHandler,
    [WebhookEventType.PROJECT_SCREEN]: projectScreenHandler,
    [WebhookEventType.PROJECT_SCREEN_VERSION]: projectScreenVersionHandler
} as const;

export function getNotificationHandler(eventType: WebhookEventType): NotificationHandler<WebhookEvent> {
    return notificationMap[eventType];
}
