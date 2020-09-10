import { StyleguideWebhookEventType, StyleguideWebhook } from "../types";
import { Requester } from "../requester";

interface StyleguideWebhookCreateBody {
    url: string;
    events: StyleguideWebhookEventType[];
    secret: string;
}

interface StyleguideWebhookCreateParams {
    styleguideId: string;
}

interface StyleguideWebhookCommonParams {
    styleguideId: string;
    webhookId: string;
}

interface StyleguideWebhookCommonOptions {
    authToken: string;
}

interface StyleguideWebhookCreateParameter {
    body: StyleguideWebhookCreateBody;
    params: StyleguideWebhookCreateParams;
    options: StyleguideWebhookCommonOptions;
}

interface StyleguideWebhookUpdateParameter {
    body: Partial<StyleguideWebhookCreateBody>;
    params: StyleguideWebhookCommonParams;
    options: StyleguideWebhookCommonOptions;
}

interface StyleguideWebhookDeleteParameter {
    params: StyleguideWebhookCommonParams;
    options: StyleguideWebhookCommonOptions;
}

interface StyleguideWebhookGetParameter {
    params: StyleguideWebhookCommonParams;
    options: StyleguideWebhookCommonOptions;
}

export class StyleguideWebhooks {
    private readonly requester: Requester;

    constructor(requester: Requester) {
        this.requester = requester;
    }

    create(
        {
            params: { styleguideId },
            body,
            options: { authToken }
        }: StyleguideWebhookCreateParameter
    ): Promise<string> {
        return this.requester.createResource(
            `/styleguides/${styleguideId}/webhooks`,
            body,
            {
                headers: {
                    Authorization: authToken
                }
            }
        );
    }

    async update(
        {
            params: {
                styleguideId,
                webhookId
            },
            body,
            options: { authToken }
        }: StyleguideWebhookUpdateParameter
    ): Promise<void> {
        await this.requester.patch(
            `/styleguides/${styleguideId}/webhooks/${webhookId}`,
            body,
            {
                headers: {
                    Authorization: authToken
                }
            }
        );
    }

    delete(
        {
            params: {
                styleguideId,
                webhookId
            },
            options: { authToken }
        }: StyleguideWebhookDeleteParameter
    ): Promise<void> {
        return this.requester.delete(
            `/styleguides/${styleguideId}/webhooks/${webhookId}`,
            {
                headers: {
                    Authorization: authToken
                }
            }
        );
    }

    get(
        {
            params: {
                styleguideId,
                webhookId
            },
            options: { authToken }
        }: StyleguideWebhookGetParameter
    ): Promise<StyleguideWebhook> {
        return this.requester.get(
            `/styleguides/${styleguideId}/webhooks/${webhookId}`,
            {
                headers: {
                    Authorization: authToken
                }
            }
        );
    }
}
