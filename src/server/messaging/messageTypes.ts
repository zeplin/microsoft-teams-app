export type WebhookEvent = any;
export type MessageJobData = {
    id: string;
    groupingKey: string;
    event: WebhookEvent;
}