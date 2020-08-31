import { StyleguideWebhookEvent } from "./WebhookEvents";
import { WebhookStatus } from "./WebhookStatus";
import { WebhookUrlHealth } from "./WebhookUrlHealth";
import { User } from "./User";
import { ZeplinApplication } from "./ZeplinApplication";

export interface StyleguideWebhook {
    id: string;
    url: string;
    name: string;
    status: WebhookStatus;
    url_health: WebhookUrlHealth;
    created: number;
    updated: number;
    created_by: User;
    updated_by: User;
    zeplin_app?: ZeplinApplication;
    events: StyleguideWebhookEvent[];
}
