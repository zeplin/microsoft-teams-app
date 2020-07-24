import { createClient, RedisClient } from "redis";
import { promisify } from "util";

class Redis {
    private redis!: RedisClient;
    close!: () => Promise<"OK">;
    get!: (key: string) => Promise<string>;
    set!: (key: string, val: string) => Promise<"OK">;
    flush!: () => Promise<string>;

    init(url: string): void {
        this.redis = createClient(url);
        this.close = promisify(this.redis.quit).bind(this.redis);
        this.get = promisify(this.redis.get).bind(this.redis);
        this.set = promisify<string, string, "OK">(this.redis.set).bind(this.redis);
        this.flush = promisify<string>(this.redis.flushall).bind(this.redis);
    }
}

export const redis = new Redis();