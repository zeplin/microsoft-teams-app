import { messageFacade } from "./messageFacade";
import { messageJobRepo, messageWebhookEventRepo } from "../messagingRepos";
import { messageQueue } from "../messageQueue";
import { WebhookEvent } from "../messageTypes";

jest.mock("../messageQueue", () => ({
    messageQueue: {
        process: jest.fn((handler: Function): Promise<void> => {
            handler();
            return Promise.resolve();
        }),
        add: jest.fn()
    }
}));

const exampleEvent = { webhookId: "webhook-id", deliveryId: "delivery-id" } as WebhookEvent;
const expectedGroupingKey = `${exampleEvent.webhookId}:others`;
const expectedJobId = exampleEvent.deliveryId;
const expectedDelay = 5000;

const exampleJobData = {
    id: "example-job-id",
    groupingKey: "example-grouping-key"
};

describe("messageFacade", () => {
    describe("`handleEventArrived` function", () => {
        let setGroupActiveJobIdSpy: jest.SpyInstance<Promise<void>, [string, string]>;
        let addEventToGroupSpy: jest.SpyInstance<Promise<void>, [string, WebhookEvent]>;
        beforeAll(() => {
            setGroupActiveJobIdSpy = jest.spyOn(messageJobRepo, "setGroupActiveJobId").mockImplementation();
            addEventToGroupSpy = jest.spyOn(messageWebhookEventRepo, "addEventToGroup").mockImplementation();
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it("should update active job id for group", async () => {
            await messageFacade.handleEventArrived(exampleEvent);
            expect(setGroupActiveJobIdSpy).toBeCalledWith(expectedGroupingKey, expectedJobId);
        });

        it("should add event to events for group", async () => {
            await messageFacade.handleEventArrived(exampleEvent);
            expect(addEventToGroupSpy).toBeCalledWith(expectedGroupingKey, exampleEvent);
        });

        it("should add a new job for the event group", async () => {
            await messageFacade.handleEventArrived(exampleEvent);
            expect(messageQueue.add).toBeCalledWith({
                id: expectedJobId,
                groupingKey: expectedGroupingKey
            }, {
                delay: expectedDelay
            });
        });
    });

    describe("`processJob` function", () => {
        it("should not get and remove events when there isn't job id for the group", async () => {
            const getGroupActiveJobIdSpy = jest.spyOn(messageJobRepo, "getGroupActiveJobId").mockImplementation(() => Promise.resolve(null));
            const getAndRemoveGroupEventsSpy = jest.spyOn(messageWebhookEventRepo, "getAndRemoveGroupEvents").mockImplementation();

            await messageFacade.processJob(exampleJobData);
            expect(getAndRemoveGroupEventsSpy).not.toBeCalled();

            getGroupActiveJobIdSpy.mockRestore();
            getAndRemoveGroupEventsSpy.mockRestore();
        });

        it("should not get and remove events when the job is not the active one for the group", async () => {
            const getGroupActiveJobIdSpy = jest.spyOn(messageJobRepo, "getGroupActiveJobId").mockImplementation(() => Promise.resolve("another-job-id"));
            const getAndRemoveGroupEventsSpy = jest.spyOn(messageWebhookEventRepo, "getAndRemoveGroupEvents").mockImplementation();

            await messageFacade.processJob(exampleJobData);
            expect(getAndRemoveGroupEventsSpy).not.toBeCalled();

            getGroupActiveJobIdSpy.mockRestore();
            getAndRemoveGroupEventsSpy.mockRestore();
        });

        it("should get and remove events when the job is the active one for the group", async () => {
            const getGroupActiveJobIdSpy = jest.spyOn(messageJobRepo, "getGroupActiveJobId").mockImplementation(() => Promise.resolve(exampleJobData.id));
            const getAndRemoveGroupEventsSpy = jest.spyOn(messageWebhookEventRepo, "getAndRemoveGroupEvents").mockImplementation();

            await messageFacade.processJob(exampleJobData);
            expect(getAndRemoveGroupEventsSpy).toBeCalledWith(exampleJobData.groupingKey);

            getGroupActiveJobIdSpy.mockRestore();
            getAndRemoveGroupEventsSpy.mockRestore();
        });
    });
});