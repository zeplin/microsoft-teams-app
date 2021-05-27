import { Schema } from "mongoose";
import { WebhookResourceTypeEnum } from "../../enums";

export const configurationSchema = new Schema({
    zeplin: {
        webhookId: {
            type: String,
            required: true
        },
        resource: {
            id: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true,
                enum: Object.values(WebhookResourceTypeEnum)
            }
        },
        workspaceId: {
            type: String,
            required: true
        }
    },
    microsoftTeams: {
        channel: {
            name: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            }
        },
        incomingWebhookUrl: {
            type: String,
            required: true
        },
        tenantId: {
            type: String,
            required: true
        }
    }
}, {
    toJSON: {
        getters: true,
        virtuals: false
    },
    toObject: {
        getters: true,
        virtuals: false
    },
    timestamps: true
});
