import { WebhookEvent } from "../../../adapters/zeplin/types";
import { MessageCard } from "./teamsCardTemplates";

export abstract class NotificationHandler<E extends WebhookEvent> {
    abstract get delay(): number;
    abstract getTeamsMessage(events: E[]): MessageCard;
    abstract shouldHandleEvent(event: WebhookEvent): boolean;
    getGroupingKey(event: E): string {
        const {
            event: eventType,
            action
        } = event.payload;
        return `${event.webhookId}:${eventType}:${action}`;
    }
}
