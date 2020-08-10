import { messageFacade } from "./messageFacade";
import { messageJobRepo, messageWebhookEventRepo } from "../messagingRepos";
import { messageQueue } from "../messageQueue";
import { WebhookEvent } from "../messagingTypes";
import { NotificationHandler } from "./messageFacadeNotificationHandlers/NotificationHandler";
import { configurationRepo } from "../../../repos";

jest.mock("../messageQueue", () => ({
    messageQueue: {
        process: jest.fn((handler: Function): Promise<void> => {
            handler();
            return Promise.resolve();
        }),
        add: jest.fn()
    }
}));

jest.mock("../../../adapters/requester");

jest.mock("../../../repos", () => ({
    configurationRepo: {
        existsForWebhook: jest.fn().mockReturnValue(Promise.resolve(true)),
        getIncomingWebhookURLForWebhook: jest.fn().mockReturnValue(Promise.resolve("https://ergun.sh"))
    }
}));

jest.mock("../messagingRepos", () => ({
    messageJobRepo: {
        setGroupActiveJobId: jest.fn(),
        getGroupActiveJobId: jest.fn()
    },
    messageWebhookEventRepo: {
        addEventToGroup: jest.fn(),
        getAndRemoveGroupEvents: jest.fn()
    }
}));

const exampleEvent = {
    webhookId: "webhook-id",
    deliveryId: "delivery-id",
    payload: {
        event: "project.color"
    }
} as WebhookEvent;
const expectedGroupingKey = `${exampleEvent.webhookId}:others`;
const expectedJobId = exampleEvent.deliveryId;
const expectedDelay = 5000;

const exampleJobData = {
    id: "example-job-id",
    groupingKey: "example-grouping-key"
};

const mockNotificationHandler = {
    delay: expectedDelay,
    getGroupingKey: jest.fn().mockReturnValue(expectedGroupingKey),
    getTeamsMessage: jest.fn().mockReturnValue("a nice messaage")
};

jest.mock("./messageFacadeNotificationHandlers", () => ({
    getNotificationHandler: (): NotificationHandler => mockNotificationHandler
}));

describe("messageFacade", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("`handleEventArrived` function", () => {
        // TODO: Check error itself too
        it("should throw error when there isn't any configuration for the webhook event", async () => {
            jest.spyOn(configurationRepo, "existsForWebhook").mockReturnValueOnce(Promise.resolve(false));
            await expect(() => messageFacade.handleEventArrived(exampleEvent)).rejects.toThrow();
        });

        it("should update active job id for group", async () => {
            await messageFacade.handleEventArrived(exampleEvent);
            expect(messageJobRepo.setGroupActiveJobId).toBeCalledWith(expectedGroupingKey, expectedJobId);
        });

        it("should add event to events for group", async () => {
            await messageFacade.handleEventArrived(exampleEvent);
            expect(messageWebhookEventRepo.addEventToGroup).toBeCalledWith(expectedGroupingKey, exampleEvent);
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
        // TODO: Check error itself too
        it("should throw error when there isn't any event for the group", async () => {
            jest.spyOn(messageWebhookEventRepo, "getAndRemoveGroupEvents").mockResolvedValueOnce([]);
            jest.spyOn(messageJobRepo, "getGroupActiveJobId").mockResolvedValueOnce(exampleJobData.id);
            await expect(() => messageFacade.processJob(exampleJobData)).rejects.toThrow();
        });

        it("should not get and remove events when there isn't job id for the group", async () => {
            jest.spyOn(messageJobRepo, "getGroupActiveJobId").mockResolvedValueOnce(null);
            const getAndRemoveGroupEventsSpy = jest.spyOn(messageWebhookEventRepo, "getAndRemoveGroupEvents").mockResolvedValueOnce([exampleEvent, exampleEvent]);

            await messageFacade.processJob(exampleJobData);
            expect(getAndRemoveGroupEventsSpy).not.toBeCalled();
        });

        it("should not get and remove events when the job is not the active one for the group", async () => {
            jest.spyOn(messageJobRepo, "getGroupActiveJobId").mockResolvedValueOnce("another-job-id");
            const getAndRemoveGroupEventsSpy = jest.spyOn(messageWebhookEventRepo, "getAndRemoveGroupEvents").mockResolvedValueOnce([exampleEvent, exampleEvent]);

            await messageFacade.processJob(exampleJobData);
            expect(getAndRemoveGroupEventsSpy).not.toBeCalled();
        });

        it("should get and remove events when the job is the active one for the group", async () => {
            jest.spyOn(messageJobRepo, "getGroupActiveJobId").mockResolvedValueOnce(exampleJobData.id);
            const getAndRemoveGroupEventsSpy = jest.spyOn(messageWebhookEventRepo, "getAndRemoveGroupEvents").mockResolvedValueOnce([exampleEvent, exampleEvent]);

            await messageFacade.processJob(exampleJobData);
            expect(getAndRemoveGroupEventsSpy).toBeCalledWith(exampleJobData.groupingKey);
        });
    });
});