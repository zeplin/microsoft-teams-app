import { configurationRepo } from "../../repos";
import { ProjectWebhookEvent, StyleguideWebhookEvent, WebhookResourceType, zeplin } from "../../adapters";
import { BASE_URL, WEBHOOK_SECRET } from "../../config";

interface Configuration {
    id: string;
}

interface ProjectParameters {
    resource: {
        id: string;
        type: WebhookResourceType.PROJECT;
    };
    events: ProjectWebhookEvent[];
}

interface StyleguideParameters {
    resource: {
        id: string;
        type: WebhookResourceType.STYLEGUIDE;
    };
    events: StyleguideWebhookEvent[];
}

interface ConfigurationCreateParameters {
    zeplin: ProjectParameters | StyleguideParameters;
    microsoftTeams: {
        channel: {
            name: string;
            id: string;
        };
        incomingWebhookUrl: string;
        tenantId: string;
    };
}

interface ConfigurationCreateOptions {
    authToken: string;
}

class ConfigurationFacade {
    private isProjectParameters(params: StyleguideParameters | ProjectParameters): params is ProjectParameters {
        return params.resource.type === WebhookResourceType.PROJECT;
    }

    private createWebhook(
        params: StyleguideParameters | ProjectParameters,
        { authToken }: ConfigurationCreateOptions
    ): Promise<string> {
        if (this.isProjectParameters(params)) {
            return zeplin.projectWebhooks.create({
                params: {
                    projectId: params.resource.id
                },
                body: {
                    url: `${BASE_URL}/api/webhook`,
                    secret: WEBHOOK_SECRET,
                    events: params.events
                },
                options: {
                    authToken
                }
            });
        }
        return zeplin.styleguideWebhooks.create({
            params: {
                styleguideId: params.resource.id
            },
            body: {
                url: `${BASE_URL}/api/webhook`,
                secret: WEBHOOK_SECRET,
                events: params.events
            },
            options: {
                authToken
            }
        });
    }

    async create(
        params: ConfigurationCreateParameters,
        options: ConfigurationCreateOptions
    ): Promise<Configuration> {
        const webhookId = await this.createWebhook(params.zeplin, options);
        const { _id } = await configurationRepo.create({
            ...params,
            zeplin: {
                webhookId,
                resource: params.zeplin.resource
            }
        });
        return {
            id: _id.toHexString()
        };
    }
}

export const configurationFacade = new ConfigurationFacade();
