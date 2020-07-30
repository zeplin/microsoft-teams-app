import { Schema } from "mongoose";
import { WebhookResourceType } from "../../../enums";

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
            },
            url: {
                type: String,
                required: true
            }
        },
        groupId: {
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
