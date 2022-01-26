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
import { projectFlowBoardHandler } from "./projectFlowBoardHandler";

const notificationMap: Record<string, NotificationHandler<WebhookEvent>> = {
    "ping": pingHandler,
    "project.color": projectColorHandler,
    "project.note": projectNoteHandler,
    "project.note.comment": projectNoteCommentHandler,
    "project.spacing_token": projectSpacingTokenHandler,
    "project.text_style": projectTextStyleHandler,
    "project.member": projectMemberHandler,
    "project.component": projectComponentHandler,
    "project.screen": projectScreenHandler,
    "project.screen.version": projectScreenVersionHandler,
    "project.flow_board": projectFlowBoardHandler,
    "styleguide.color": styleguideColorHandler,
    "styleguide.text_style": styleguideTextStyleHandler,
    "styleguide.spacing_token": styleguideSpacingTokenHandler,
    "styleguide.member": styleguideMemberHandler,
    "styleguide.component": styleguideComponentHandler
} as const;

export function getNotificationHandler(eventType: string): NotificationHandler<WebhookEvent> {
    return notificationMap[eventType];
}
