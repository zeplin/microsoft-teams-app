import { messageJobRepo } from "./messageJobRepo";
import { redis } from "../../../../adapters";

const EXPECTED_TTL = 3600;

describe("messageJobRepo", () => {
    describe("setGroupActiveJobId function", () => {
        it("should call redis setWithTTL with correct parameters", async () => {
            const setWithTTLSpy = jest.spyOn(redis, "setWithTTL").mockImplementation();
            const exampleGroupingKey = "grouping-key";
            const exampleJobId = "job-id";

            await messageJobRepo.setGroupActiveJobId(exampleGroupingKey, exampleJobId);
            expect(setWithTTLSpy).toBeCalledWith(`job_ids:${exampleGroupingKey}`, exampleJobId, EXPECTED_TTL);

            setWithTTLSpy.mockRestore();
        });
    });

    describe("getGroupActiveJobId function", () => {
        it("should return job id from Redis", async () => {
            const exampleGroupingKey = "grouping-key";
            const exampleJobId = "job-id";
            const getSpy = jest.spyOn(redis, "get").mockImplementation(() => Promise.resolve(exampleJobId));

            const result = await messageJobRepo.getGroupActiveJobId(exampleGroupingKey);
            expect(result).toEqual(exampleJobId);

            getSpy.mockRestore();
        });

        it("should return null when grouping key doesn't have an active job in Redis", async () => {
            const exampleGroupingKey = "grouping-key";
            const getSpy = jest.spyOn(redis, "get").mockImplementation(() => Promise.resolve(null));

            const result = await messageJobRepo.getGroupActiveJobId(exampleGroupingKey);
            expect(result).toBeNull();

            getSpy.mockRestore();
        });
    });
});
