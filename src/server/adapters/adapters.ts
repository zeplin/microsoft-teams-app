import { redis } from "./redis";
import { Config } from "../config";
import { zeplin } from "./zeplin";
import { mongo } from "./mongo";
import { sentry } from "./sentry";
import { messageQueue } from "./messageQueue";
import { mixpanel } from "./mixpanel";

export async function initAdapters(config: Config): Promise<void> {
    sentry.init({
        dsn: config.SENTRY_DSN,
        environment: config.ENVIRONMENT,
        enabled: config.IS_SENTRY_ENABLED,
        version: config.VERSION
    });
    redis.init(config.REDIS_URL);
    zeplin.init({ url: config.ZEPLIN_URL });
    messageQueue.init(config.REDIS_URL);
    mixpanel.init({
        apiToken: config.MIXPANEL_TOKEN,
        enabled: config.IS_MIXPANEL_ENABLED
    });
    await mongo.init(config.MONGO_URL, { isDebug: config.IS_MONGO_DEBUG });
}

export async function closeAdapters(): Promise<void> {
    await mongo.close();
    await redis.close();
}
