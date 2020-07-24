import { WebhookEvent } from "../messageTypes";
import { redis } from "../../../server/adapters";

function getRedisKey(groupKey: string): string {
    return `webhook_events:${groupKey}`;
}

class MessageWebhookEventRepo {
    async addEventToGroup(groupKey: string, event: WebhookEvent): Promise<void> {
        await redis.lpush(getRedisKey(groupKey), JSON.stringify(event));
    }

    async getAndRemoveGroupEvents(groupKey: string): Promise<WebhookEvent[]> {
        // TODO: Handle error?
        const rawEvents = await redis.getAllAndDel(getRedisKey(groupKey));
        return rawEvents.map(rawEvent => JSON.parse(rawEvent));
    }
}

export const messageWebhookEventRepo = new MessageWebhookEventRepo();