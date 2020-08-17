import { ResourceType } from "./ResourceType";

export interface WebhookEvent {
    title: string;
    description: string;
    resourceTypes: ResourceType[];
}
