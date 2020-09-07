import { mongo } from "../../adapters";
import { WebhookResourceType } from "../../adapters/zeplin/types";
import { Model } from "mongoose";
import { configurationSchema } from "./configurationSchema";
import { ConfigurationDocument } from "./ConfigurationDocument";

interface ConfigurationCreateParameters {
    zeplin: {
        webhookId: string;
        resource: {
            id: string;
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

type Configuration = Pick<ConfigurationDocument, "_id" | "zeplin" | "microsoftTeams">;

class ConfigurationRepo {
    model: Model<ConfigurationDocument>;

    constructor() {
        this.model = mongo.createModel("configuration", configurationSchema);
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
}

export const configurationRepo = new ConfigurationRepo();
