import { redis } from "../../adapters";

function getRedisKey(groupKey: string): string {
    return `job_ids:${groupKey}`;
}

class MessageJobRepo {
    async setGroupJobId(groupKey: string, jobId: string): Promise<void> {
        await redis.set(getRedisKey(groupKey), jobId);
    }

    async getGroupJobId(groupKey: string): Promise<string|null> {
        const result = await redis.get(getRedisKey(groupKey));
        if (result) {
            return result;
        }

        return null;
    }
}

export const messageJobRepo = new MessageJobRepo();