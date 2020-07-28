import { redis } from "./redis";
import * as config from "../../../config";
import { redisHelper } from "../../test/helpers";

describe("Redis adapter", () => {
    beforeAll(async () => {
        await redisHelper.init(config.REDIS_URL);
        await redisHelper.flush();

        await redis.init(config.REDIS_URL);
    });

    describe("getAllAndDel function", () => {
        it("should return empty array when key is not found", async () => {
            const result = await redis.getAllAndDel("not-found-key");
            expect(result).toEqual([]);
        });

        it("should return array with values when key is found and delete key afterwards", async () => {
            const foundKey = "found-key-1";
            await redisHelper.lpush(foundKey, "val1");
            await redisHelper.lpush(foundKey, "val2");

            const result = await redis.getAllAndDel(foundKey);
            expect(result.sort()).toEqual(["val1", "val2"]);
        });

        it("should delete key after getting the values", async () => {
            const foundKey = "found-key-3";
            await redisHelper.lpush(foundKey, "val1");

            await redis.getAllAndDel(foundKey);

            const afterKeys = await redisHelper.keys(foundKey);
            expect(afterKeys).toEqual([]);
        });
    });

    describe("setWithTTL function", () => {
        it("should set key, value with a second TTL", async () => {
            const key = "key-ttl";
            const value = "value-ttl";
            const ttl = 3600;

            await redis.setWithTTL(key, value, ttl);

            const foundValue = await redisHelper.get(key);
            expect(foundValue).toEqual(value);

            const foundTTL = await redisHelper.ttl(key);
            expect(ttl - foundTTL < 1).toBe(true);
        });
    });

    afterAll(async () => {
        await redisHelper.close();
        await redis.close();
    });
});