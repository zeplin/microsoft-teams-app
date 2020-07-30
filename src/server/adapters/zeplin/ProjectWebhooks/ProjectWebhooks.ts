import { ProjectWebhookEvents } from "../../../enums";
import { Requester } from "../requester";

interface WebhookCreatePayload {
    url: string;
    events: ProjectWebhookEvents[];
}

export class ProjectWebhooks {
    private readonly requester: Requester;
    private readonly secret: string;

    constructor(requester: Requester, secret: string) {
        this.requester = requester;
        this.secret = secret;
    }

    create(projectId: string, authToken: string, payload: WebhookCreatePayload): Promise<string> {
        return this.requester.post(
            `/projects/${projectId}/webhooks`,
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
