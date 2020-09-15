import { WebhookEvent } from "../../adapters/zeplin/types";
import { messageQueue, requester } from "../../adapters";
import { messageJobRepo, webhookEventRepo, configurationRepo } from "../../repos";
import { getNotificationHandler } from "./notificationHandlers";
import { ServerError } from "../../errors";

interface JobData {
    groupingKey: string;
    id: string;
}

const isOlderEventOfSameResource = (a: WebhookEvent, b: WebhookEvent): boolean => {
    if ("id" in a.payload.resource && "id" in b.payload.resource) {
        return a.payload.resource.id === b.payload.resource.id && a.payload.timestamp < b.payload.timestamp;
    }
    return false;
};

const getRecentEventsOfSameResources = (events: WebhookEvent[]): WebhookEvent[] => events.filter(
    current => events.find(item => isOlderEventOfSameResource(current, item)) === undefined
);

class WebhookEventService {
    async processJob(data: JobData): Promise<void> {
        const activeJobId = await messageJobRepo.getGroupActiveJobId(data.groupingKey);
        if (!activeJobId || data.id !== activeJobId) {
            return;
        }

        const events = await webhookEventRepo.getAndRemoveGroupEvents(data.groupingKey);
        const [pivotEvent] = events;
        if (!pivotEvent) {
            throw new ServerError("There isn't any event found for the grouping key", {
                extra: { data }
            });
        }

        const configuration = await configurationRepo.getByWebhookId(
            pivotEvent.webhookId
        );
        if (!configuration) {
            throw new ServerError("There isn't any incoming webhook URL found for webhook", {
                extra: { data, pivotEvent }
            });
        }

        const notificationHandler = getNotificationHandler(pivotEvent.payload.event);
        const distinctEvents = getRecentEventsOfSameResources(events);
        const message = notificationHandler.getTeamsMessage(distinctEvents);
        await requester.post(configuration.microsoftTeams.incomingWebhookUrl, message);
    }

    async handleEventArrived(event: WebhookEvent): Promise<void> {
        const notificationHandler = getNotificationHandler(event.payload.event);
        if (!notificationHandler.shouldHandleEvent(event)) {
            return;
        }

        const groupingKey = notificationHandler.getGroupingKey(event);
        const jobId = event.deliveryId;

        const configuration = await configurationRepo.getByWebhookId(event.webhookId);
        if (!configuration) {
            throw new ServerError("Event doesn't have configuration", {
                extra: {
                    event: JSON.stringify(event)
                }
            });
        }

        await messageJobRepo.setGroupActiveJobId(groupingKey, jobId);
        await webhookEventRepo.addEventToGroup(groupingKey, event);

        await messageQueue.add(
            { id: jobId, groupingKey },
            { delay: notificationHandler.delay }
        );
    }
}

export const webhookEventService = new WebhookEventService();
