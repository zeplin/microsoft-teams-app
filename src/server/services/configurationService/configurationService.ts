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
import { mixpanel, redis, zeplin } from "../../adapters";
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
        workspaceId: string;
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

type ZeplinParameters = (ProjectParameters | StyleguideParameters) & {
    workspaceId: string;
};

interface ConfigurationCreateParameters {
    zeplin: ZeplinParameters;
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
    zeplin: ZeplinParameters;
}

interface ConfigurationCommonOptions {
    authToken: string;
}

interface ResourceParams {
    id: string;
    type: WebhookResourceType;
}

enum ConfigurationWorkspaceType {
    ORGANIZATION = "Organization",
    PERSONAL = "Personal"
}

enum ConfigurationTrackingIntegrationType {
    PROJECT = "Project",
    STYLEGUIDE = "Styleguide"
}

interface ConfigurationTrackingParameters {
    userId: string;
    workspaceId: string;
    resourceType: WebhookResourceType;
    tenantId: string;
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
            return zeplin.webhooks.projectWebhooks.create({
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
        return zeplin.webhooks.styleguideWebhooks.create({
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
            await zeplin.webhooks.projectWebhooks.update({
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
            await zeplin.webhooks.styleguideWebhooks.update({
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
            return zeplin.webhooks.projectWebhooks.delete({
                params: {
                    projectId: resource.id,
                    webhookId
                },
                options: {
                    authToken
                }
            });
        }
        return zeplin.webhooks.styleguideWebhooks.delete({
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
            return zeplin.webhooks.projectWebhooks.get({
                params: {
                    projectId: resource.id,
                    webhookId
                },
                options: {
                    authToken
                }
            });
        }
        return zeplin.webhooks.styleguideWebhooks.get({
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

    private async getUserId(options: ConfigurationCommonOptions): Promise<string> {
        const user = await zeplin.me.get({ options });

        return user.id;
    }

    private async trackConfigurationCreate(params: ConfigurationTrackingParameters): Promise<void> {
        const {
            userId,
            workspaceId,
            resourceType,
            tenantId
        } = params;

        const integrationType = resourceType === WebhookResourceType.PROJECT
            ? ConfigurationTrackingIntegrationType.PROJECT
            : ConfigurationTrackingIntegrationType.STYLEGUIDE;

        await mixpanel.trackEvent("Created Microsoft Teams integration", {
            "distinct_id": userId,
            ...(workspaceId === "personal" ? {
                "Workspace Type": ConfigurationWorkspaceType.PERSONAL
            } : {
                "Workspace Type": ConfigurationWorkspaceType.ORGANIZATION,
                "Organization ID": workspaceId
            }),
            "Integration Type": integrationType,
            "Tenant ID": tenantId
        });
    }

    private async trackConfigurationDelete(params: ConfigurationTrackingParameters): Promise<void> {
        const {
            userId,
            workspaceId,
            resourceType,
            tenantId
        } = params;

        const integrationType = resourceType === WebhookResourceType.PROJECT
            ? ConfigurationTrackingIntegrationType.PROJECT
            : ConfigurationTrackingIntegrationType.STYLEGUIDE;

        await mixpanel.trackEvent("Removed Microsoft Teams integration", {
            "distinct_id": userId,
            ...(workspaceId === "personal" ? {
                "Workspace Type": ConfigurationWorkspaceType.PERSONAL
            } : {
                "Workspace Type": ConfigurationWorkspaceType.ORGANIZATION,
                "Organization ID": workspaceId
            }),
            "Integration Type": integrationType,
            "Tenant ID": tenantId
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

        const [webhookId, userId] = await Promise.all([
            this.createWebhook(params.zeplin, options),
            this.getUserId(options)
        ]);
        const { _id } = await configurationRepo.create({
            ...params,
            zeplin: {
                webhookId,
                workspaceId: params.zeplin.workspaceId,
                resource: params.zeplin.resource
            }
        });

        await unlock();
        await this.trackConfigurationCreate({
            userId,
            workspaceId: params.zeplin.workspaceId,
            resourceType: params.zeplin.resource.type,
            tenantId: params.microsoftTeams.tenantId
        });

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
            await configurationRepo.delete(configurationId);
            const [userId] = await Promise.all([
                this.getUserId(options),
                this.deleteWebhook(configuration.zeplin.webhookId, configuration.zeplin.resource, options)
            ]);
            await this.trackConfigurationDelete({
                userId,
                workspaceId: configuration.zeplin.workspaceId,
                resourceType: configuration.zeplin.resource.type,
                tenantId: configuration.microsoftTeams.tenantId
            });
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
                },
                workspaceId: configuration.zeplin.webhookId
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
