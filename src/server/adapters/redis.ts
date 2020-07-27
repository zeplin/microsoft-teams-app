import { createClient, RedisClient } from "redis";

class Redis {
    private redis!: RedisClient;

    init(url: string): void {
        this.redis = createClient(url);
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

    lpush(key: string, ...args: string[]): Promise<number> {
        return new Promise((resolve, reject) => {
            this.redis.lpush(key, ...args, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result);
            });
        });
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

    set(key: string, value: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.redis.set(key, value, err => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
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