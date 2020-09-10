import { webhookEventRepo } from "./webhookEventRepo";
import { redis } from "../../adapters";
import { WebhookEvent } from "../../adapters/zeplin/types";

const exampleGroupingKey = "example-grouping-key";
const exampleEvent = {
    webhookId: "webhook-id",
    deliveryId: "deliveryId",
    payload: {}
} as WebhookEvent;

describe("messageWebhookEventRepo", () => {
    describe("addEventToGroup function", () => {
        it("should call redis lpush with correct parameters", async () => {
            const redisLPushSpy = jest.spyOn(redis, "lpush").mockImplementation();

            await webhookEventRepo.addEventToGroup(exampleGroupingKey, exampleEvent);
            expect(redisLPushSpy).toBeCalledWith(`webhook_events:${exampleGroupingKey}`, JSON.stringify(exampleEvent));

            redisLPushSpy.mockRestore();
        });
    });

    describe("getAndRemoveGroupEvents function", () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it("should return empty array when there isn't any list in the key", async () => {
            jest.spyOn(redis, "getAllAndDel").mockImplementation(() => Promise.resolve([]));

            const result = await webhookEventRepo.getAndRemoveGroupEvents("example-grouping-key");
            expect(result).toEqual([]);
        });

        it("should call redis getAllAndDel with correct parameters and return webhook events", async () => {
            jest.spyOn(redis, "getAllAndDel").mockImplementation(() => Promise.resolve([
                JSON.stringify(exampleEvent)
            ]));

            const result = await webhookEventRepo.getAndRemoveGroupEvents("example-grouping-key");
            expect(result).toEqual([exampleEvent]);
        });
    });
});
