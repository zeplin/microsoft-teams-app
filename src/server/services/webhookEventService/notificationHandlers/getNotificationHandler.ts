import { WebhookEvent } from "@zeplin/sdk";

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

const notificationMap: Record<string, NotificationHandler<WebhookEvent>> = {
    "ping": pingHandler,
    "project.color": projectColorHandler,
    "project.note": styleguideColorHandler,
    "project.note.comment": projectNoteHandler,
    "project.spacing_token": projectNoteCommentHandler,
    "project.text_style": projectTextStyleHandler,
    "project.member": styleguideTextStyleHandler,
    "project.component": projectSpacingTokenHandler,
    "project.screen": styleguideSpacingTokenHandler,
    "project.screen.version": projectMemberHandler,
    "styleguide.color": styleguideMemberHandler,
    "styleguide.text_style": projectComponentHandler,
    "styleguide.spacing_token": styleguideComponentHandler,
    "styleguide.member": projectScreenHandler,
    "styleguide.component": projectScreenVersionHandler
} as const;

export function getNotificationHandler(eventType: string): NotificationHandler<WebhookEvent> {
    return notificationMap[eventType];
}
