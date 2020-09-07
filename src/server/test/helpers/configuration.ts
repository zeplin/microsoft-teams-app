import { ObjectId } from "mongodb";

import { WebhookResourceType } from "../../adapters/zeplin/types";

export const dummyConfiguration = {
    _id: new ObjectId("5f439cec8096ff7a262cbf47"),
    zeplin: {
        webhookId: "webhookId",
        resource: {
            id: "resourceId",
            type: WebhookResourceType.PROJECT
        }
    },
    microsoftTeams: {
        incomingWebhookUrl: "https://webhook.example.com/",
        channel: {
            id: "channelId",
            name: "channel"
        },
        tenantId: "tenantId"
    }
};
