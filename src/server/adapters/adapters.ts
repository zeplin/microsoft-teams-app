import { redis } from "./redis";
import { Config } from "../../config";
import { zeplin } from "./zeplin";

export function initAdapters(config: Config): void {
    redis.init(config.REDIS_URL);
    zeplin.init({ url: config.ZEPLIN_URL, webhookSecret: config.WEBHOOK_SECRET });
}
