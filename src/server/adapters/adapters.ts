import { redis } from "./redis";

type AdaptersConfig = {
    REDIS_URL: string;
}

export function initAdapters(config: AdaptersConfig): void {
    redis.init(config.REDIS_URL);
}
