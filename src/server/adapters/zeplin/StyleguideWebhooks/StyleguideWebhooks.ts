import { StyleguideWebhookEvent } from "../types";
import { Requester } from "../requester";
import { StyleguideWebhook } from "../types/StyleguideWebhook";

interface StyleguideWebhookCreateBody {
    url: string;
    events: StyleguideWebhookEvent[];
    secret: string;
}

interface StyleguideWebhookCreateParams {
    styleguideId: string;
}

interface StyleguideWebhookCreateOptions {
    authToken: string;
}

interface StyleguideWebhookCreateParameter {
    body: StyleguideWebhookCreateBody;
    params: StyleguideWebhookCreateParams;
    options: StyleguideWebhookCreateOptions;
}

interface StyleguideWebhookDeleteParameter {
    params: {
        styleguideId: string;
        webhookId: string;
    };
    options: {
        authToken: string;
    };
}

interface StyleguideWebhookGetParameter {
    params: {
        styleguideId: string;
        webhookId: string;
    };
    options: {
        authToken: string;
    };
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
