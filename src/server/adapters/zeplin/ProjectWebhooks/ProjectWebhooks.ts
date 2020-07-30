import { ProjectWebhookEvent } from "../../../enums";
import { Requester } from "../requester";

interface ProjectWebhookCreatePayload {
    url: string;
    events: ProjectWebhookEvent[];
}

interface ProjectWebhookCreateParams {
    projectId: string;
}

interface ProjectWebhookCreateOptions {
    authToken: string;
}

export class ProjectWebhooks {
    private readonly requester: Requester;
    private readonly secret: string;

    constructor(requester: Requester, secret: string) {
        this.requester = requester;
        this.secret = secret;
    }

    create(
        { projectId }: ProjectWebhookCreateParams,
        payload: ProjectWebhookCreatePayload,
        { authToken }: ProjectWebhookCreateOptions
    ): Promise<string> {
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
