import { ProjectWebhookEvent, ProjectWebhook } from "../types";
import { Requester } from "../requester";

interface ProjectWebhookCreateBody {
    url: string;
    events: ProjectWebhookEvent[];
    secret: string;
}

interface ProjectWebhookCreateParams {
    projectId: string;
}

interface ProjectWebhookCommonParams {
    projectId: string;
    webhookId: string;
}

interface ProjectWebhookCommonOptions {
    authToken: string;
}

interface ProjectWebhookCreateParameter {
    body: ProjectWebhookCreateBody;
    params: ProjectWebhookCreateParams;
    options: ProjectWebhookCommonOptions;
}

interface ProjectWebhookUpdateParameter {
    body: Partial<ProjectWebhookCreateBody>;
    params: ProjectWebhookCommonParams;
    options: ProjectWebhookCommonOptions;
}

interface ProjectWebhookDeleteParameter {
    params: ProjectWebhookCommonParams;
    options: ProjectWebhookCommonOptions;
}

interface ProjectWebhookGetParameter {
    params: ProjectWebhookCommonParams;
    options: ProjectWebhookCommonOptions;
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

    async update(
        {
            params: {
                projectId,
                webhookId
            },
            body,
            options: { authToken }
        }: ProjectWebhookUpdateParameter
    ): Promise<void> {
        await this.requester.patch(
            `/projects/${projectId}/webhooks/${webhookId}`,
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

    get(
        {
            params: {
                projectId,
                webhookId
            },
            options: { authToken }
        }: ProjectWebhookGetParameter
    ): Promise<ProjectWebhook> {
        return this.requester.get(
            `/projects/${projectId}/webhooks/${webhookId}`,
            {
                headers: {
                    Authorization: authToken
                }
            }
        );
    }
}
