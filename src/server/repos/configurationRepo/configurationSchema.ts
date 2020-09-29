import { Schema } from "mongoose";
import { WebhookResourceType } from "../../adapters/zeplin/types";

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
                enum: Object.values(WebhookResourceType)
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
