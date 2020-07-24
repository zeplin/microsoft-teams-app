import { redis } from "../../adapters";

function getRedisKey(groupingKey: string): string {
    return `job_ids:${groupingKey}`;
}

class MessageJobRepo {
    async setGroupJobId(groupingKey: string, jobId: string): Promise<void> {
        await redis.set(getRedisKey(groupingKey), jobId);
    }

    async getGroupJobId(groupingKey: string): Promise<string|null> {
        const result = await redis.get(getRedisKey(groupingKey));
        if (result) {
            return result;
        }

        return null;
    }
}

export const messageJobRepo = new MessageJobRepo();