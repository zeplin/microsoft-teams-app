import { StyleguideWebhookEvent } from "../../../enums";
import { Requester } from "../requester";

interface StyleguideWebhookCreatePayload {
    url: string;
    events: StyleguideWebhookEvent[];
}

interface StyleguideWebhookCreateParams {
    styleguideId: string;
}

interface StyleguideWebhookCreateOptions {
    authToken: string;
}

export class StyleguideWebhooks {
    private readonly requester: Requester;
    private readonly secret: string;

    constructor(requester: Requester, secret: string) {
        this.requester = requester;
        this.secret = secret;
    }

    create(
        { styleguideId }: StyleguideWebhookCreateParams,
        payload: StyleguideWebhookCreatePayload,
        { authToken }: StyleguideWebhookCreateOptions
    ): Promise<string> {
        return this.requester.post(
            `/styleguides/${styleguideId}/webhooks`,
            {
                secret: this.secret,
                ...payload
            },
            {
                headers: {
                    Authorization: authToken
                }
            }
        );
    }
}
