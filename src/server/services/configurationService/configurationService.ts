import { NOT_FOUND, UNPROCESSABLE_ENTITY } from "http-status-codes";
import {
    Project,
    ProjectWebhook,
    ProjectWebhookEventEnum,
    Styleguide,
    StyleguideWebhook,
    StyleguideWebhookEventEnum
} from "@zeplin/sdk";

import { configurationRepo } from "../../repos";
import { mixpanel, redis, Zeplin } from "../../adapters";
import { BASE_URL, WEBHOOK_SECRET } from "../../config";
import { ServerError } from "../../errors";
import { WebhookResourceTypeEnum } from "../../enums";

interface ConfigurationResponse {
    id: string;
    zeplin: {
        webhook: ProjectWebhook | StyleguideWebhook;
        resource: (Project | Styleguide) & {
            type: WebhookResourceTypeEnum;
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
        type: WebhookResourceTypeEnum.PROJECT;
    };
    events: ProjectWebhookEventEnum[];
}

interface StyleguideParameters {
    resource: {
        id: string;
        type: WebhookResourceTypeEnum.STYLEGUIDE;
    };
    events: StyleguideWebhookEventEnum[];
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
    accessToken: string;
}

interface ResourceParams {
    id: string;
    type: WebhookResourceTypeEnum;
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
    resourceType: WebhookResourceTypeEnum;
    tenantId: string;
}

class ConfigurationService {
    private isProjectParameters(params: StyleguideParameters | ProjectParameters): params is ProjectParameters {
        return params.resource.type === WebhookResourceTypeEnum.PROJECT;
    }

    private async createWebhook(
        params: StyleguideParameters | ProjectParameters,
        { accessToken }: ConfigurationCommonOptions
    ): Promise<string> {
        const zeplin = new Zeplin({ accessToken });
        if (this.isProjectParameters(params)) {
            const { data: { id } } = await zeplin.webhooks.createProjectWebhooks(
                params.resource.id,
                {
                    url: `${BASE_URL}/api/webhook`,
                    secret: WEBHOOK_SECRET,
                    events: new Set(params.events)
                }
            );
            return id;
        }
        const { data: { id } } = await zeplin.webhooks.createStyleguideWebhooks(
            params.resource.id,
            {
                url: `${BASE_URL}/api/webhook`,
                secret: WEBHOOK_SECRET,
                events: new Set(params.events)
            }
        );
        return id;
    }

    private async updateWebhook(
        webhookId: string,
        params: StyleguideParameters | ProjectParameters,
        { accessToken }: ConfigurationCommonOptions
    ): Promise<void> {
        const zeplin = new Zeplin({ accessToken });

        if (this.isProjectParameters(params)) {
            await zeplin.webhooks.updateProjectWebhooks(
                params.resource.id,
                webhookId,
                {
                    events: new Set(params.events)
                }
            );
        } else {
            await zeplin.webhooks.updateStyleguideWebhooks(
                params.resource.id,
                webhookId,
                {
                    events: new Set(params.events)
                }
            );
        }
    }

    private async deleteWebhook(
        webhookId: string,
        resource: ResourceParams,
        { accessToken }: ConfigurationCommonOptions
    ): Promise<void> {
        const zeplin = new Zeplin({ accessToken });
        if (resource.type === WebhookResourceTypeEnum.PROJECT) {
            await zeplin.webhooks.deleteProjectWebhook(resource.id, webhookId);
        } else {
            await zeplin.webhooks.deleteStyleguideWebhook(resource.id, webhookId);
        }
    }

    private async getWebhook(
        webhookId: string,
        resource: ResourceParams,
        { accessToken }: ConfigurationCommonOptions
    ): Promise<ProjectWebhook | StyleguideWebhook> {
        const zeplin = new Zeplin({ accessToken });
        if (resource.type === WebhookResourceTypeEnum.PROJECT) {
            const { data } = await zeplin.webhooks.getProjectWebhook(
                resource.id,
                webhookId
            );
            return data;
        }
        const { data } = await zeplin.webhooks.getStyleguideWebhook(
            resource.id,
            webhookId
        );
        return data;
    }

    private async getResource(
        resource: ResourceParams,
        { accessToken }: ConfigurationCommonOptions
    ): Promise<Project | Styleguide> {
        const zeplin = new Zeplin({ accessToken });
        if (resource.type === WebhookResourceTypeEnum.PROJECT) {
            const { data } = await zeplin.projects.getProject(resource.id);
            return data;
        }
        const { data } = await zeplin.styleguides.getStyleguide(resource.id);
        return data;
    }

    private async getUserId({ accessToken }: ConfigurationCommonOptions): Promise<string> {
        const zeplin = new Zeplin({ accessToken });

        const { data: { id } } = await zeplin.users.getCurrentUser();

        return id;
    }

    private async trackConfigurationCreate(params: ConfigurationTrackingParameters): Promise<void> {
        const {
            userId,
            workspaceId,
            resourceType,
            tenantId
        } = params;

        const integrationType = resourceType === WebhookResourceTypeEnum.PROJECT
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

        const integrationType = resourceType === WebhookResourceTypeEnum.PROJECT
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
