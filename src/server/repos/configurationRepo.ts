import { mongo } from "../adapters";
import { ObjectId } from "mongodb";

class ConfigurationRepo {
    existsForWebhook(webhookId: string): Promise<boolean> {
        return mongo.configuration.collection.find({
            "zeplin.webhookId": webhookId
        }).limit(1).hasNext();
    }

    async getIncomingWebhookURLsForWebhook(webhookId: string): Promise<string[]> {
        const partialConfigurations = await mongo.configuration.find({
            "zeplin.webhookId": webhookId
        }, {
            "microsoftTeams.channel.incomingWebhookUrl": 1
        }).lean() as {
            _id: ObjectId;
            microsoftTeams: {
                channel: {
                    incomingWebhookUrl: string;
                };
            };
        }[];

        return partialConfigurations.map(
            partialConfiguration =>
                partialConfiguration.microsoftTeams.channel.incomingWebhookUrl
        );
    }
}

export const configurationRepo = new ConfigurationRepo();