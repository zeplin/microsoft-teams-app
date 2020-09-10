import { WebhookEventType } from "./WebhookEventTypes";

export interface PingEvent {
    webhookId: string;
    deliveryId: string;
    payload: {
        event: WebhookEventType.PING;
        action: "ping";
        timestamp: number;
        context: {};
        resource: {};
    };
}
