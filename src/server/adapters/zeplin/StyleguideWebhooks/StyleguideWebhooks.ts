import { StyleguideWebhookEvent } from "../../../enums";
import { Requester } from "../requester";

interface WebhookCreatePayload {
    url: string;
    events: StyleguideWebhookEvent[];
}

export class StyleguideWebhooks {
    private readonly requester: Requester;
    private readonly secret: string;

    constructor(requester: Requester, secret: string) {
        this.requester = requester;
        this.secret = secret;
    }

    create(styleguideId: string, authToken: string, payload: WebhookCreatePayload): Promise<string> {
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
