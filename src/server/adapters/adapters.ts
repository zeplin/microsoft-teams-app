import { redis } from "./redis";
import { Config } from "../../config";

export function initAdapters(config: Config): void {
    redis.init(config.REDIS_URL);
}
