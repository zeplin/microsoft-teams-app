import { ProjectWebhookEvent } from "../types";
import { Requester } from "../requester";

interface ProjectWebhookCreateBody {
    url: string;
    events: ProjectWebhookEvent[];
    secret: string;
}

interface ProjectWebhookCreateParams {
    projectId: string;
}

interface ProjectWebhookCreateOptions {
    authToken: string;
}

interface ProjectWebhookCreateParameter {
    body: ProjectWebhookCreateBody;
    params: ProjectWebhookCreateParams;
    options: ProjectWebhookCreateOptions;
}

interface ProjectWebhookDeleteParameter {
    params: {
        projectId: string;
        webhookId: string;
    };
    options: {
        authToken: string;
    };
}

export class ProjectWebhooks {
    private readonly requester: Requester;

    constructor(requester: Requester) {
        this.requester = requester;
    }

    create(
        {
            params: { projectId },
            body,
            options: { authToken }
        }: ProjectWebhookCreateParameter
    ): Promise<string> {
        return this.requester.createResource(
            `/projects/${projectId}/webhooks`,
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
                projectId,
                webhookId
            },
            options: { authToken }
        }: ProjectWebhookDeleteParameter
    ): Promise<void> {
        return this.requester.delete(
            `/projects/${projectId}/webhooks/${webhookId}`,
            {
                headers: {
                    Authorization: authToken
                }
            }
        );
    }
}
