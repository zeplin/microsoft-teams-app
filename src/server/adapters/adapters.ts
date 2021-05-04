import { redis } from "./redis";
import { Config } from "../config";
import { Zeplin } from "./zeplin";
import { mongo } from "./mongo";
import { messageQueue } from "./messageQueue";
import { mixpanel } from "./mixpanel";
import { logger } from "./logger";

export async function initAdapters(config: Config): Promise<void> {
    logger.init({
        logDNAApiKey: config.LOG_DNA_KEY,
        sentryDSN: config.SENTRY_DSN,
        version: config.VERSION,
        level: config.LOG_LEVEL,
        environment: config.ENVIRONMENT
    });
    redis.init(config.REDIS_URL);
    Zeplin.init({ url: config.ZEPLIN_URL });
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
    await logger.flush();
}
