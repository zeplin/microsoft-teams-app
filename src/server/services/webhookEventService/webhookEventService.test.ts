import { webhookEventService } from "./webhookEventService";
import { messageQueue, requester } from "../../adapters";
import { WebhookEvent } from "../../adapters/zeplin/types";
import { configurationRepo, messageJobRepo, webhookEventRepo } from "../../repos";
import { dummyConfiguration } from "../../test/helpers";
import { ServerError } from "../../errors";
import { NotificationHandler } from "./notificationHandlers/NotificationHandler";

jest.mock("../../adapters/messageQueue", () => ({
    messageQueue: {
        process: jest.fn((handler: Function): Promise<void> => {
            handler();
            return Promise.resolve();
        }),
        add: jest.fn()
    }
}));

jest.mock("../../adapters/requester");

jest.mock("../../repos", () => ({
    messageJobRepo: {
        setGroupActiveJobId: jest.fn(),
        getGroupActiveJobId: jest.fn()
    },
    webhookEventRepo: {
        addEventToGroup: jest.fn(),
        getAndRemoveGroupEvents: jest.fn()
    },
    configurationRepo: {
        getByWebhookId: jest.fn()
    }
}));

const getExampleEvent = ({ resourceId = "resource-id", timestamp = 1 } = {}): WebhookEvent => ({
    webhookId: "webhook-id",
    deliveryId: "delivery-id",
    payload: {
        event: "project.color",
        timestamp,
        resource: {
            id: resourceId
        }
    }
}) as WebhookEvent;

const expectedGroupingKey = `webhook-id:others`;
const expectedJobId = "delivery-id";
const expectedDelay = 5000;

const exampleJobData = {
    id: "example-job-id",
    groupingKey: "example-grouping-key"
};

const mockNotificationHandler = {
    delay: expectedDelay,
    getGroupingKey: jest.fn().mockReturnValue(expectedGroupingKey),
    shouldHandleEvent: jest.fn().mockReturnValue(true),
    getTeamsMessage: jest.fn().mockReturnValue({
        text: "gol"
    })
};

jest.mock("./notificationHandlers", () => ({
    getNotificationHandler: (): NotificationHandler<WebhookEvent> => mockNotificationHandler
}));

describe("webhookEventService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("`handleEventArrived` function", () => {
        it("should throw error when there isn't any configuration for the webhook event", async () => {
            jest.spyOn(configurationRepo, "getByWebhookId").mockResolvedValueOnce(null);
            await expect(() => webhookEventService.handleEventArrived(getExampleEvent())).rejects.toThrow(new ServerError("Event doesn't have configuration"));
        });

        it("should update active job id for group", async () => {
            jest.spyOn(configurationRepo, "getByWebhookId").mockResolvedValueOnce(dummyConfiguration);
            await webhookEventService.handleEventArrived(getExampleEvent());
            expect(messageJobRepo.setGroupActiveJobId).toBeCalledWith(expectedGroupingKey, expectedJobId);
        });

        it("should add event to events for group", async () => {
            jest.spyOn(configurationRepo, "getByWebhookId").mockResolvedValueOnce(dummyConfiguration);
            await webhookEventService.handleEventArrived(getExampleEvent());
            expect(webhookEventRepo.addEventToGroup).toBeCalledWith(expectedGroupingKey, getExampleEvent());
        });

        it("should add a new job for the event group", async () => {
            jest.spyOn(configurationRepo, "getByWebhookId").mockResolvedValueOnce(dummyConfiguration);
            await webhookEventService.handleEventArrived(getExampleEvent());
            expect(messageQueue.add).toBeCalledWith({
                id: expectedJobId,
                groupingKey: expectedGroupingKey
            }, {
                delay: expectedDelay
            });
        });

        it("should not handle event when notificationHandler.shouldReturnEvent returns false", async () => {
            mockNotificationHandler.shouldHandleEvent.mockReturnValueOnce(false);
            await webhookEventService.handleEventArrived(getExampleEvent());
            expect(mockNotificationHandler.getGroupingKey).not.toBeCalled();
        });
    });

    describe("`processJob` function", () => {
        let getAndRemoveGroupEventsSpy: jest.SpyInstance;
        beforeAll(() => {
            getAndRemoveGroupEventsSpy = jest.spyOn(webhookEventRepo, "getAndRemoveGroupEvents");
        });

        afterEach(() => {
            getAndRemoveGroupEventsSpy.mockRestore();
        });

        it("should throw error when there isn't any event for the group", async () => {
            jest.spyOn(webhookEventRepo, "getAndRemoveGroupEvents").mockResolvedValueOnce([]);
            jest.spyOn(messageJobRepo, "getGroupActiveJobId").mockResolvedValueOnce(exampleJobData.id);
            await expect(() => webhookEventService.processJob(exampleJobData)).rejects.toThrow(new ServerError("There isn't any event found for the grouping key"));
        });

        it("should throw error when there isn't any incoming webhook URL for webhook", async () => {
            jest.spyOn(configurationRepo, "getByWebhookId").mockResolvedValueOnce(null);
            jest.spyOn(messageJobRepo, "getGroupActiveJobId").mockResolvedValueOnce(exampleJobData.id);
            jest.spyOn(webhookEventRepo, "getAndRemoveGroupEvents").mockResolvedValueOnce([getExampleEvent(), getExampleEvent()]);
            await expect(() => webhookEventService.processJob(exampleJobData)).rejects.toThrow(new ServerError("There isn't any incoming webhook URL found for webhook"));
        });

        it("should not get and remove events when there isn't job id for the group", async () => {
            jest.spyOn(messageJobRepo, "getGroupActiveJobId").mockResolvedValueOnce(null);
            getAndRemoveGroupEventsSpy.mockResolvedValueOnce([getExampleEvent(), getExampleEvent()]);

            await webhookEventService.processJob(exampleJobData);
            expect(getAndRemoveGroupEventsSpy).not.toBeCalled();
        });

        it("should not get and remove events when the job is not the active one for the group", async () => {
            jest.spyOn(messageJobRepo, "getGroupActiveJobId").mockResolvedValueOnce("another-job-id");
            getAndRemoveGroupEventsSpy.mockResolvedValueOnce([getExampleEvent(), getExampleEvent()]);

            await webhookEventService.processJob(exampleJobData);
            expect(getAndRemoveGroupEventsSpy).not.toBeCalled();
        });

        it("should post message when the job is the active one and there are events for the group", async () => {
            const events = [getExampleEvent({ resourceId: "resource-id-other" }), getExampleEvent()];
            const message = mockNotificationHandler.getTeamsMessage();
            jest.spyOn(configurationRepo, "getByWebhookId").mockResolvedValueOnce(dummyConfiguration);
            jest.spyOn(messageJobRepo, "getGroupActiveJobId").mockResolvedValueOnce(exampleJobData.id);
            getAndRemoveGroupEventsSpy.mockResolvedValueOnce(events);

            await webhookEventService.processJob(exampleJobData);
            expect(getAndRemoveGroupEventsSpy).toBeCalledWith(exampleJobData.groupingKey);
            expect(mockNotificationHandler.getTeamsMessage).toBeCalledWith(events);
            expect(requester.post).toBeCalledWith(dummyConfiguration.microsoftTeams.incomingWebhookUrl, message);
        });

        it("should filter out older events for same resource", async () => {
            const events = [getExampleEvent({ timestamp: 1 }), getExampleEvent({ timestamp: 2 })];
            const message = mockNotificationHandler.getTeamsMessage();
            jest.spyOn(configurationRepo, "getByWebhookId").mockResolvedValueOnce(dummyConfiguration);
            jest.spyOn(messageJobRepo, "getGroupActiveJobId").mockResolvedValueOnce(exampleJobData.id);
            getAndRemoveGroupEventsSpy.mockResolvedValueOnce(events);

            await webhookEventService.processJob(exampleJobData);
            expect(getAndRemoveGroupEventsSpy).toBeCalledWith(exampleJobData.groupingKey);
            expect(mockNotificationHandler.getTeamsMessage).toBeCalledWith([events[1]]);
            expect(requester.post).toBeCalledWith(dummyConfiguration.microsoftTeams.incomingWebhookUrl, message);
        });
    });
});
