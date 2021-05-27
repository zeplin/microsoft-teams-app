import { WebhookEvent } from "@zeplin/sdk";

import { MessageCard } from "./teamsCardTemplates";

export interface GroupingKeyParams<E extends WebhookEvent> {
    event: E;
    webhookId: string;
    deliveryId: string;
}

export abstract class NotificationHandler<E extends WebhookEvent> {
    abstract get delay(): number;
    abstract getTeamsMessage(events: E[]): MessageCard;
    abstract shouldHandleEvent(event: WebhookEvent): boolean;
    getGroupingKey({
        event: {
            event: eventType,
            action
        },
        webhookId
    }: GroupingKeyParams<E>): string {
        return `${webhookId}:${eventType}:${action}`;
    }
}
