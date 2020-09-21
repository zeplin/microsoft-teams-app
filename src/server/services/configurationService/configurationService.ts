import { configurationRepo } from "../../repos";
import {
    ProjectWebhookEventType,
    StyleguideWebhookEventType,
    WebhookResourceType,
    ProjectWebhook,
    StyleguideWebhook,
    Project,
    Styleguide
} from "../../adapters/zeplin/types";
import { redis, zeplin } from "../../adapters";
import { BASE_URL, WEBHOOK_SECRET } from "../../config";
import { ServerError } from "../../errors";
import { NOT_FOUND, UNPROCESSABLE_ENTITY } from "http-status-codes";

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
    events: ProjectWebhookEventType[];
}

interface StyleguideParameters {
    resource: {
        id: string;
        type: WebhookResourceType.STYLEGUIDE;
    };
    events: StyleguideWebhookEventType[];
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

interface ConfigurationUpdateParameters {
    configurationId: string;
    zeplin: ProjectParameters | StyleguideParameters;
}

interface ConfigurationCommonOptions {
    authToken: string;
}

interface ResourceParams {
    id: string;
    type: WebhookResourceType;
}

class ConfigurationService {
    private isProjectParameters(params: StyleguideParameters | ProjectParameters): params is ProjectParameters {
        return params.resource.type === WebhookResourceType.PROJECT;
    }

    private createWebhook(
        params: StyleguideParameters | ProjectParameters,
        { authToken }: ConfigurationCommonOptions
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

    private async updateWebhook(
        webhookId: string,
        params: StyleguideParameters | ProjectParameters,
        { authToken }: ConfigurationCommonOptions
    ): Promise<void> {
        if (this.isProjectParameters(params)) {
            await zeplin.projectWebhooks.update({
                params: {
                    projectId: params.resource.id,
                    webhookId
                },
                body: {
                    events: params.events
                },
                options: {
                    authToken
                }
            });
        } else {
            await zeplin.styleguideWebhooks.update({
                params: {
                    styleguideId: params.resource.id,
                    webhookId
                },
                body: {
                    events: params.events
                },
                options: {
                    authToken
                }
            });
        }
    }

    private deleteWebhook(
        webhookId: string,
        resource: ResourceParams,
        { authToken }: ConfigurationCommonOptions
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
        webhookId: string,
        resource: ResourceParams,
        { authToken }: ConfigurationCommonOptions
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
        resource: ResourceParams,
        { authToken }: ConfigurationCommonOptions
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
        options: ConfigurationCommonOptions
    ): Promise<{ id: string }> {
        const unlock = await redis.lock(`lock:configuration:${params.zeplin.resource.id}`);

        const configuration = await configurationRepo.getByResourceAndChannel(
            params.zeplin.resource.type,
            params.zeplin.resource.id,
            params.microsoftTeams.channel.id
        );

        if (configuration) {
            await unlock();
            throw new ServerError(
                "Configuration is already created",
                {
                    statusCode: UNPROCESSABLE_ENTITY,
                    title: "Configuration is already created"
                });
        }

        const webhookId = await this.createWebhook(params.zeplin, options);
        const { _id } = await configurationRepo.create({
            ...params,
            zeplin: {
                webhookId,
                resource: params.zeplin.resource
            }
        });

        await unlock();

        return {
            id: _id.toHexString()
        };
    }

    async delete(
        configurationId: string,
        options: ConfigurationCommonOptions
    ): Promise<void> {
        const configuration = await configurationRepo.get(configurationId);
        if (configuration) {
            await this.deleteWebhook(configuration.zeplin.webhookId, configuration.zeplin.resource, options);
            await configurationRepo.delete(configurationId);
        }
    }

    async get(
        configurationId: string,
        options: ConfigurationCommonOptions
    ): Promise<ConfigurationResponse> {
        const configuration = await configurationRepo.get(configurationId);

        if (!configuration) {
            throw new ServerError(
                "Configuration not found",
                {
                    statusCode: NOT_FOUND,
                    title: "Configuration not found"
                });
        }

        const [webhook, resource] = await Promise.all([
            this.getWebhook(configuration.zeplin.webhookId, configuration.zeplin.resource, options),
            this.getResource(configuration.zeplin.resource, options)
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

    async update(
        parameters: ConfigurationUpdateParameters,
        options: ConfigurationCommonOptions
    ): Promise<void> {
        const configuration = await configurationRepo.get(parameters.configurationId);

        if (
            !configuration ||
            parameters.zeplin.resource.id !== configuration.zeplin.resource.id ||
            parameters.zeplin.resource.type !== configuration.zeplin.resource.type
        ) {
            // TODO: log the case and create alert when resource mismatch
            throw new ServerError(
                "Configuration not found",
                {
                    statusCode: NOT_FOUND,
                    title: "Configuration not found"
                });
        }

        await this.updateWebhook(
            configuration.zeplin.webhookId,
            parameters.zeplin,
            options
        );
    }
}

export const configurationService = new ConfigurationService();
