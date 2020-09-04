import { WebhookEvent } from "../../../../adapters/zeplin/types";
import { MessageCard } from "./teamsCardTemplates";

export abstract class NotificationHandler {
    abstract get delay(): number;
    abstract getTeamsMessage(events: WebhookEvent[]): MessageCard;
    abstract shouldHandleEvent(event: WebhookEvent): boolean;
    getGroupingKey(event: WebhookEvent): string {
        const {
            event: eventType,
            action
        } = event.payload;
        return `${event.webhookId}:${eventType}:${action}`;
    }
}
