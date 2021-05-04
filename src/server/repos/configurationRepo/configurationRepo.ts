import { Model } from "mongoose";

import { mongo } from "../../adapters";
import { WebhookResourceTypeEnum } from "../../enums";

import { configurationSchema } from "./configurationSchema";
import { ConfigurationDocument } from "./ConfigurationDocument";

interface ConfigurationCreateParameters {
    zeplin: {
        webhookId: string;
        resource: {
            id: string;
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

type Configuration = Pick<ConfigurationDocument, "_id" | "zeplin" | "microsoftTeams">;

class ConfigurationRepo {
    modelCache?: Model<ConfigurationDocument>;

    private get model(): Model<ConfigurationDocument> {
        if (!this.modelCache) {
            this.modelCache = mongo.createModel("configuration", configurationSchema);
        }
        return this.modelCache;
    }

    async getByWebhookId(webhookId: string): Promise<Configuration | null> {
        const result = await this.model.findOne({
            "zeplin.webhookId": webhookId
        }).lean().exec();
        return result ?? null;
    }

    async get(id: string): Promise<Configuration | null> {
        const result = await this.model.findById(id).lean().exec();
        return result ?? null;
    }

    async delete(id: string): Promise<void> {
        await this.model.deleteOne({ _id: id }).lean().exec();
    }

    async create(parameters: ConfigurationCreateParameters): Promise<Configuration> {
        const { _id, zeplin, microsoftTeams } = await this.model.create(parameters);
        return { _id, zeplin, microsoftTeams };
    }

    listByResourceAndChannel(
        resourceType: WebhookResourceTypeEnum,
        resourceIds: string[],
        channelId: string
    ): Promise<Configuration[]> {
        return this.model.find({
            "zeplin.resource.type": resourceType,
            "zeplin.resource.id": {
                $in: resourceIds
            },
            "microsoftTeams.channel.id": channelId
        }).lean().exec();
    }

    async getByResourceAndChannel(
        resourceType: WebhookResourceTypeEnum,
        resourceId: string,
        channelId: string
    ): Promise<Configuration | null> {
        const result = await this.model.findOne({
            "zeplin.resource.type": resourceType,
            "zeplin.resource.id": resourceId,
            "microsoftTeams.channel.id": channelId
        }).lean().exec();
        return result ?? null;
    }
}

export const configurationRepo = new ConfigurationRepo();
