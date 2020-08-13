import { projectColorNotificationHandler } from "./projectColorNotificationHandler";
import { NotificationHandler } from "./NotificationHandler";
import { EventType } from "../../messagingTypes";
import { styleguideColorNotificationHandler } from "./styleguideColorNotificationHandler";
import { projectTextStyleNotificationHandler } from "./projectTextStyleNotificationHandler";
import { styleguideTextStyleNotificationHandler } from "./styleguideTextStyleNotificationHandler";

const notificationMap: Record<EventType, NotificationHandler> = {
    [EventType.PROJECT_COLOR]: projectColorNotificationHandler,
    [EventType.STYLEGUIDE_COLOR]: styleguideColorNotificationHandler,
    [EventType.PROJECT_TEXT_STYLE]: projectTextStyleNotificationHandler,
    [EventType.STYLEGUIDE_TEXT_STYLE]: styleguideTextStyleNotificationHandler
} as const;

export function getNotificationHandler(eventType: EventType): NotificationHandler {
    return notificationMap[eventType];
}