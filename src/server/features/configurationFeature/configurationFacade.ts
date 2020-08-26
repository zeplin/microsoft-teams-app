import { Configuration, configurationRepo } from "../../repos";
import {
    ProjectWebhookEvent,
    StyleguideWebhookEvent,
    WebhookResourceType,
    ProjectWebhook,
    StyleguideWebhook,
    zeplin,
    Project,
    Styleguide
} from "../../adapters";
import { BASE_URL, WEBHOOK_SECRET } from "../../config";
import { ServiceError } from "../../errors";
import { NOT_FOUND } from "http-status-codes";

interface ConfigurationResponse {
    id: string;
    zeplin: {
        webhook: ProjectWebhook | StyleguideWebhook;
        resource: (Project | Styleguide) & {
            type: WebhookResourceType;
        };
    };
    microsoftTeams: {
        channel: {
            name: string;
            id: string;
        };
        incomingWebhookUrl: string;
        tenantId: string;
    };
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

    private deleteWebhook(
        { zeplin: { resource, webhookId } }: Configuration,
        authToken: string
    ): Promise<void> {
        if (resource.type === WebhookResourceType.PROJECT) {
            return zeplin.projectWebhooks.delete({
                params: {
                    projectId: resource.id,
                    webhookId
                },
                options: {
                    authToken
                }
            });
        }
        return zeplin.styleguideWebhooks.delete({
            params: {
                styleguideId: resource.id,
                webhookId
            },
            options: {
                authToken
            }
        });
    }

    private getWebhook(
        { zeplin: { resource, webhookId } }: Configuration,
        authToken: string
    ): Promise<ProjectWebhook | StyleguideWebhook> {
        if (resource.type === WebhookResourceType.PROJECT) {
            return zeplin.projectWebhooks.get({
                params: {
                    projectId: resource.id,
                    webhookId
                },
                options: {
                    authToken
                }
            });
        }
        return zeplin.styleguideWebhooks.get({
            params: {
                styleguideId: resource.id,
                webhookId
            },
            options: {
                authToken
            }
        });
    }

    private getResource(
        { zeplin: { resource } }: Configuration,
        authToken: string
    ): Promise<Project | Styleguide> {
        if (resource.type === WebhookResourceType.PROJECT) {
            return zeplin.projects.get({
                params: {
                    projectId: resource.id
                },
                options: {
                    authToken
                }
            });
        }
        return zeplin.styleguides.get({
            params: {
                styleguideId: resource.id
            },
            options: {
                authToken
            }
        });
    }

    async create(
        params: ConfigurationCreateParameters,
        options: ConfigurationCreateOptions
    ): Promise<{ id: string }> {
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

    async delete(
        configurationId: string,
        authToken: string
    ): Promise<void> {
        const configuration = await configurationRepo.get(configurationId);
        if (configuration) {
            await this.deleteWebhook(configuration, authToken);
            await configurationRepo.delete(configurationId);
        }
    }

    async get(
        configurationId: string,
        authToken: string
    ): Promise<ConfigurationResponse> {
        const configuration = await configurationRepo.get(configurationId);

        if (!configuration) {
            throw new ServiceError(
                "Configuration not found",
                {
                    statusCode: NOT_FOUND,
                    title: "Configuration not found"
                });
        }

        const [webhook, resource] = await Promise.all([
            this.getWebhook(configuration, authToken),
            this.getResource(configuration, authToken)
        ]);

        return {
            id: configurationId,
            zeplin: {
                webhook,
                resource: {
                    ...resource,
                    type: configuration.zeplin.resource.type
                }
            },
            microsoftTeams: configuration.microsoftTeams
        };
    }
}

export const configurationFacade = new ConfigurationFacade();
