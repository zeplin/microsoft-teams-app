import { WebhookEvent } from "@zeplin/sdk";

import { redis } from "../../adapters";

function getRedisKey(groupingKey: string): string {
    return `webhook_events:${groupingKey}`;
}

class WebhookEventRepo {
    async addEventToGroup(groupingKey: string, event: WebhookEvent): Promise<void> {
        await redis.lpush(getRedisKey(groupingKey), JSON.stringify(event));
    }

    async getAndRemoveGroupEvents(groupingKey: string): Promise<WebhookEvent[]> {
        const rawEvents = await redis.getAllAndDel(getRedisKey(groupingKey));
        return rawEvents.map(rawEvent => JSON.parse(rawEvent));
    }
}

export const webhookEventRepo = new WebhookEventRepo();
