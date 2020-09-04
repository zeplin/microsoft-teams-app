import { Document } from "mongoose";
import { ObjectId } from "mongodb";
import { WebhookResourceType } from "../../zeplin/types";

export interface ConfigurationDocument extends Document {
    _id: ObjectId;
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
