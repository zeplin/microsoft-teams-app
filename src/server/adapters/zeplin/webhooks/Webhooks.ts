import { createHmac } from "crypto";

import { Requester } from "../requester";
import { StyleguideWebhooks } from "./StyleguideWebhooks";
import { ProjectWebhooks } from "./ProjectWebhooks";

type VerifyWebhookEventParams = {
    signature: string;
    deliveryTimestamp: number;
    secret: string;
    payload: unknown;
}

export class Webhooks {
    public styleguideWebhooks: StyleguideWebhooks;
    public projectWebhooks: ProjectWebhooks;

    constructor(requester: Requester) {
        this.styleguideWebhooks = new StyleguideWebhooks(requester);
        this.projectWebhooks = new ProjectWebhooks(requester);
    }

    verifyWebhookEvent({
        signature,
        deliveryTimestamp,
        secret,
        payload
    }: VerifyWebhookEventParams): boolean {
        const generatedSignature = createHmac("sha256", secret)
            .update(`${deliveryTimestamp}.${JSON.stringify(payload)}`)
            .digest("hex");
        return signature === generatedSignature;
    }
}
