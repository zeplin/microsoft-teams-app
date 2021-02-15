import { User } from "../User";
import { WebhookEventType } from "./WebhookEventTypes";
import { ProjectContext, StyleguideContext } from "./WebhookEventContexts";
import { WebhookEventResourceType } from "./WebhookEventResourceType";

export type BaseWebhookEvent<
    E extends WebhookEventType,
    A extends string,
    C extends ProjectContext | StyleguideContext,
    RT extends WebhookEventResourceType,
    R extends object | undefined
> = {
    webhookId: string;
    deliveryId: string;
    correlationId: string;
    signature: string;
    deliveryTimestamp: number;
    payload: {
        event: E;
        action: A;
        timestamp: number;
        context: C;
        resource: {
            id: string;
            type: RT;
            data: R;
        };
        actor: {
            user: User;
        };
    };
};
