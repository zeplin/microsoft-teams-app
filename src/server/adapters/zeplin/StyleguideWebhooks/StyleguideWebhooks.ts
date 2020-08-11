import { StyleguideWebhookEvent } from "../../../enums";
import { Requester } from "../requester";

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
}
