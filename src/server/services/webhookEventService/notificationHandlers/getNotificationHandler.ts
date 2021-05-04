import { WebhookEvent } from "@zeplin/sdk";

import { HandledWebhookEventTypeEnum } from "../../../enums";

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

const notificationMap: Record<HandledWebhookEventTypeEnum, NotificationHandler<WebhookEvent>> = {
    [HandledWebhookEventTypeEnum.PING]: pingHandler,
    [HandledWebhookEventTypeEnum.PROJECT_COLOR]: projectColorHandler,
    [HandledWebhookEventTypeEnum.STYLEGUIDE_COLOR]: styleguideColorHandler,
    [HandledWebhookEventTypeEnum.PROJECT_NOTE]: projectNoteHandler,
    [HandledWebhookEventTypeEnum.PROJECT_NOTE_COMMENT]: projectNoteCommentHandler,
    [HandledWebhookEventTypeEnum.PROJECT_TEXT_STYLE]: projectTextStyleHandler,
    [HandledWebhookEventTypeEnum.STYLEGUIDE_TEXT_STYLE]: styleguideTextStyleHandler,
    [HandledWebhookEventTypeEnum.PROJECT_SPACING_TOKEN]: projectSpacingTokenHandler,
    [HandledWebhookEventTypeEnum.STYLEGUIDE_SPACING_TOKEN]: styleguideSpacingTokenHandler,
    [HandledWebhookEventTypeEnum.PROJECT_MEMBER]: projectMemberHandler,
    [HandledWebhookEventTypeEnum.STYLEGUIDE_MEMBER]: styleguideMemberHandler,
    [HandledWebhookEventTypeEnum.PROJECT_COMPONENT]: projectComponentHandler,
    [HandledWebhookEventTypeEnum.STYLEGUIDE_COMPONENT]: styleguideComponentHandler,
    [HandledWebhookEventTypeEnum.PROJECT_SCREEN]: projectScreenHandler,
    [HandledWebhookEventTypeEnum.PROJECT_SCREEN_VERSION]: projectScreenVersionHandler
} as const;

export function getNotificationHandler(eventType: HandledWebhookEventTypeEnum): NotificationHandler<WebhookEvent> {
    return notificationMap[eventType];
}
