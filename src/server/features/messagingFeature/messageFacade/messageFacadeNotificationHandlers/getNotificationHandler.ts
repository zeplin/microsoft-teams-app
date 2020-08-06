import { projectColorNotificationHandler } from "./projectColorNotificationHandler";
import { NotificationHandler } from "./NotificationHandler";
import { EventType } from "../../messageTypes";
import { styleguideColorNotificationHandler } from "./styleguideColorNotificationHandler";

const notificationMap: Record<EventType, NotificationHandler> = {
    [EventType.PROJECT_COLOR]: projectColorNotificationHandler,
    [EventType.STYLEGUIDE_COLOR]: styleguideColorNotificationHandler
} as const;

export function getNotificationHandler(eventType: EventType): NotificationHandler {
    return notificationMap[eventType];
}