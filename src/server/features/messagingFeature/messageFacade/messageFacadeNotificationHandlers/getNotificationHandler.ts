import { projectColorNotificationHandler } from "./projectColorNotificationHandler";
import { NotificationHandler } from "./NotificationHandler";

const notificationMap: { [x: string]: NotificationHandler } = {
    "project.color": projectColorNotificationHandler
} as const;

export function getNotificationHandler(eventType: string): NotificationHandler {
    if (notificationMap[eventType]) {
        return notificationMap[eventType];
    }

    throw new Error(`No handler found for event type: ${eventType}`);
}