import { redis } from "./redis";
import { Config } from "../config";
import { zeplin } from "./zeplin";
import { mongo } from "./mongo";
import { sentry } from "./sentry";

export async function initAdapters(config: Config): Promise<void> {
    sentry.init({
        sentryDsn: config.SENTRY_DSN,
        environment: config.ENVIRONMENT,
        version: config.VERSION
    });
    redis.init(config.REDIS_URL);
    zeplin.init({ url: config.ZEPLIN_URL });
    await mongo.init(config.MONGO_URL, { isDebug: config.IS_MONGO_DEBUG });
}
