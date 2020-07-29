import { AxiosInstance } from "axios";
import { ProjectWebhookEvents } from "../../../enums";
import { ZeplinError } from "../ZeplinError";
import { INTERNAL_SERVER_ERROR } from "http-status-codes";

interface WebhookCreatePayload {
    url: string;
    events: ProjectWebhookEvents[];
}

export class ProjectWebhook {
    private readonly instance: AxiosInstance;
    private readonly secret: string;

    constructor(instance: AxiosInstance, secret: string) {
        this.instance = instance;
        this.secret = secret;
    }

    async create(projectId: string, authToken: string, payload: WebhookCreatePayload): Promise<string> {
        try {
            const { data: { id } } = await this.instance.post<{id: string}>(
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

            return id;
        } catch (error) {
            if (error.isAxiosError) {
                throw new ZeplinError(error.response.data.message, { statusCode: error.response.status });
            } else {
                throw new ZeplinError(error.message, { statusCode: INTERNAL_SERVER_ERROR });
            }
        }
    }
}
