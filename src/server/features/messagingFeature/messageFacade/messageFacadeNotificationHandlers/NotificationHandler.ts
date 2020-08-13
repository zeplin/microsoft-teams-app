import { WebhookEvent } from "../../messagingTypes";
import { AdaptiveCard } from "./teamsCardTemplates";

export abstract class NotificationHandler {
    abstract get delay(): number;
    abstract getTeamsMessage(events: WebhookEvent[]): AdaptiveCard;
    abstract shouldHandleEvent(event: WebhookEvent): boolean;
    getGroupingKey(event: WebhookEvent): string {
        const {
            event: eventType,
            action
        } = event.payload;
        return `${event.webhookId}:${eventType}:${action}`;
    }
}