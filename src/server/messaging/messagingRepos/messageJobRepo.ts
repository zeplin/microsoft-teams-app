import { redis } from "../../adapters";

const ACTIVE_JOB_TTL = 3600; // 1 Hour in seconds

function getRedisKey(groupingKey: string): string {
    return `job_ids:${groupingKey}`;
}

class MessageJobRepo {
    async setGroupActiveJobId(groupingKey: string, jobId: string): Promise<void> {
        await redis.set(getRedisKey(groupingKey), jobId, "EX", ACTIVE_JOB_TTL);
    }

    async getGroupActiveJobId(groupingKey: string): Promise<string|null> {
        const result = await redis.get(getRedisKey(groupingKey));
        if (result) {
            return result;
        }

        return null;
    }
}

export const messageJobRepo = new MessageJobRepo();