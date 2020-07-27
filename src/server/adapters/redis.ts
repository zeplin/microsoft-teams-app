import { createClient, RedisClient } from "redis";
import { promisify } from "util";

class Redis {
    private redis!: RedisClient;
    close!: () => Promise<"OK">;
    set!: (key: string, val: string) => Promise<"OK">;
    flush!: () => Promise<string>;
    lpush!: (key: string, ...args: string[]) => Promise<number>;

    init(url: string): void {
        this.redis = createClient(url);
        this.close = promisify(this.redis.quit).bind(this.redis);
        this.set = promisify(this.redis.set).bind(this.redis);
        this.flush = promisify<string>(this.redis.flushall).bind(this.redis);
        this.lpush = promisify(this.redis.lpush).bind(this.redis);
    }

    get(key: string): Promise<string|null> {
        return new Promise((resolve, reject) => {
            this.redis.get(key, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result);
            });
        });
    }

    /**
     * @param ttl Time to live in seconds
     */
    setWithTTL(key: string, value: string, ttl: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.redis.set(key, value, "EX", ttl, err => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }

    getAllAndDel(key: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.redis.multi()
                .lrange(key, 0, -1)
                .del(key)
                .exec((err, [values]) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(values);
                });
        });
    }
}

export const redis = new Redis();