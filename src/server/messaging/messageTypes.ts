export type WebhookEvent = {
    webhookId: string;
    deliveryId: string;
    payload: any;
};

export type MessageJobData = {
    id: string;
    groupingKey: string;
}