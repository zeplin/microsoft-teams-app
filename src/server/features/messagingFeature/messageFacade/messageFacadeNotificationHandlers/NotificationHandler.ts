import { WebhookEvent } from "../../messagingTypes";

export abstract class NotificationHandler {
    abstract get delay(): number;
    abstract getTeamsMessage(events: WebhookEvent[]): string;
    getGroupingKey(event: WebhookEvent): string {
        const {
            event: eventType,
            action,
            actor: {
                user: {
                    id: userId
                }
            }
        } = event.payload;
        return `${event.webhookId}:${eventType}:${action}:${userId}`;
    }
}