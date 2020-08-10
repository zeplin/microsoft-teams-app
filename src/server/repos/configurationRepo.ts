import { mongo } from "../adapters";
import { ObjectId } from "mongodb";

class ConfigurationRepo {
    existsForWebhook(webhookId: string): Promise<boolean> {
        return mongo.configuration.collection.find({
            "zeplin.webhookId": webhookId
        }).limit(1).hasNext();
    }

    async getIncomingWebhookURLForWebhook(webhookId: string): Promise<string|null> {
        const partialConfiguration = await mongo.configuration.findOne({
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
        };

        if (partialConfiguration) {
            return partialConfiguration.microsoftTeams.channel.incomingWebhookUrl;
        }

        return null;
    }
}

export const configurationRepo = new ConfigurationRepo();