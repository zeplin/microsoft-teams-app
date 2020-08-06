import { Document } from "mongoose";
import { ObjectId } from "mongodb";
import { WebhookResourceType } from "../../../enums";

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
            url: string;
            incomingWebhookUrl: string;
        };
        groupId: string;
    };
}
