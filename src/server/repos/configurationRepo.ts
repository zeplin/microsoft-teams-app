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

    async create(parameters: ConfigurationCreateParameters): Promise<Configuration> {
        const { _id, zeplin, microsoftTeams } = await mongo.configuration.create(parameters);
        return { _id, zeplin, microsoftTeams };
    }
}

export type Configuration = Pick<ConfigurationDocument, "_id" | "zeplin" | "microsoftTeams">;

export const configurationRepo = new ConfigurationRepo();
