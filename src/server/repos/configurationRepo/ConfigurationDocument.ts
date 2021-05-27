import { Document } from "mongoose";
import { ObjectId } from "mongodb";
import { WebhookResourceTypeEnum } from "../../enums";

export interface ConfigurationDocument extends Document {
    _id: ObjectId;
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
