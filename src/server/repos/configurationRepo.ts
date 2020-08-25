import { ConfigurationDocument, mongo, WebhookResourceType } from "../adapters";

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

class ConfigurationRepo {
    async getByWebhookId(webhookId: string): Promise<Configuration | null> {
        const result = await mongo.configuration.findOne({
            "zeplin.webhookId": webhookId
        }).lean().exec();
        return result ?? null;
    }

    async get(id: string): Promise<Configuration | null> {
        const result = await mongo.configuration.findById(id).lean().exec();
        return result ?? null;
    }

    async delete(id: string): Promise<void> {
        await mongo.configuration.deleteOne({ _id: id }).lean().exec();
    }

    async create(parameters: ConfigurationCreateParameters): Promise<Configuration> {
        const { _id, zeplin, microsoftTeams } = await mongo.configuration.create(parameters);
        return { _id, zeplin, microsoftTeams };
    }
}

export type Configuration = Pick<ConfigurationDocument, "_id" | "zeplin" | "microsoftTeams">;

export const configurationRepo = new ConfigurationRepo();
