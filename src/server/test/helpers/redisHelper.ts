import { RedisClient, createClient } from "redis";

class RedisHelper {
    private redis!: RedisClient;
    init(url: string): void {
        this.redis = createClient(url);
    }

    flush(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.redis.flushall(err => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }

    keys(pattern: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.redis.keys(pattern, (err, values) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(values);
            });
        });
    }

    ttl(key: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.redis.ttl(key, (err, val) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(val);
            });
        });
    }

    close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.redis.quit(err => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }
}

export const redisHelper = new RedisHelper();