export type WebhookEvent = {
    webhookId: string;
    deliveryId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
};

export type MessageJobData = {
    id: string;
    groupingKey: string;
}