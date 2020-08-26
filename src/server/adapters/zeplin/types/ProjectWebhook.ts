import { ProjectWebhookEvent } from "./WebhookEvents";
import { WebhookStatus } from "./WebhookStatus";
import { WebhookUrlHealth } from "./WebhookUrlHealth";
import { User } from "./User";
import { OAuthApplication } from "./OAuthApplication";

export interface ProjectWebhook {
    id: string;
    url: string;
    name: string;
    status: WebhookStatus;
    url_health: WebhookUrlHealth;
    created: number;
    updated: number;
    created_by: User;
    updated_by: User;
    zeplin_app?: OAuthApplication;
    events: ProjectWebhookEvent[];
}
