import { redis } from "../../../../adapters";

const ACTIVE_JOB_TTL = 3600; // 1 hour in seconds

function getRedisKey(groupingKey: string): string {
    return `job_ids:${groupingKey}`;
}

class MessageJobRepo {
    async setGroupActiveJobId(groupingKey: string, jobId: string): Promise<void> {
        await redis.setWithTTL(getRedisKey(groupingKey), jobId, ACTIVE_JOB_TTL);
    }

    getGroupActiveJobId(groupingKey: string): Promise<string|null> {
        return redis.get(getRedisKey(groupingKey));
    }
}

export const messageJobRepo = new MessageJobRepo();
