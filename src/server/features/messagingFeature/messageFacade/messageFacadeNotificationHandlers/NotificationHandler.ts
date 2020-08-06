import { WebhookEvent } from "../../messageTypes";

export abstract class NotificationHandler {
    abstract get delay(): number;
    abstract getTeamsMessage(events: WebhookEvent[]): string;
    getGroupingKey(event: WebhookEvent): string {
        return `${event.webhookId}:others`;
    }
}