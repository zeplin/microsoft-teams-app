import { WebhookEventType } from "./WebhookEventTypes";

export interface PingEvent {
    webhookId: string;
    deliveryId: string;
    deliveryTimestamp: number;
    payload: {
        event: WebhookEventType.PING;
        action: "ping";
        timestamp: number;
        context: {};
        resource: {};
    };
}
