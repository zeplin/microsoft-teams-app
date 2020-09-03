import { redis } from "./redis";
import { Config } from "../config";
import { zeplin } from "./zeplin";
import { mongo } from "./mongo";
import { sentry } from "./sentry";

export function initAdapters(config: Config): void {
    redis.init(config.REDIS_URL);
    zeplin.init({ url: config.ZEPLIN_URL });
    mongo.init(config.MONGO_URL, { isDebug: config.IS_MONGO_DEBUG });
    sentry.init({
        dsn: config.SENTRY_DSN,
        environment: config.ENVIRONMENT,
        enabled: config.IS_SENTRY_ENABLED,
        version: config.VERSION
    });
}
