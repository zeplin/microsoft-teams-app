import { GONE, UNAUTHORIZED } from "http-status-codes";

import { PingEvent, WebhookEvent, WebhookEventType } from "../../adapters/zeplin/types";
import { messageQueue, requester, zeplin } from "../../adapters";
import { configurationRepo, messageJobRepo, webhookEventRepo } from "../../repos";
import { getNotificationHandler } from "./notificationHandlers";
import { ServerError } from "../../errors";
import { WEBHOOK_SECRET } from "../../config";

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

const isPingEvent = (event: WebhookEvent): event is PingEvent => event.payload.event === WebhookEventType.PING;

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

        try {
            await requester.post(configuration.microsoftTeams.incomingWebhookUrl, message);
        } catch (error) {
            if (error instanceof ServerError && error.statusCode === GONE) {
                await configurationRepo.delete(configuration._id.toHexString());
            } else {
                throw error;
            }
        }
    }

    async handleEventArrived(event: WebhookEvent): Promise<void> {
        // TODO: remove if check when ping event is sent
        if (!isPingEvent(event)) {
            const isVerifiedEvent = zeplin.webhooks.verifyWebhookEvent({
                signature: event.signature,
                deliveryTimestamp: event.deliveryTimestamp,
                secret: WEBHOOK_SECRET,
                payload: event.payload
            });
            if (!isVerifiedEvent) {
                throw new ServerError(
                    "Event is not verified",
                    {
                        statusCode: UNAUTHORIZED,
                        shouldCapture: true,
                        extra: {
                            event: JSON.stringify(event)
                        }
                    }
                );
            }
        }

        const notificationHandler = getNotificationHandler(event.payload.event);
        if (!notificationHandler.shouldHandleEvent(event)) {
            return;
        }

        const groupingKey = notificationHandler.getGroupingKey(event);
        const jobId = event.deliveryId;

        const configuration = await configurationRepo.getByWebhookId(event.webhookId);
        if (!configuration) {
            throw new ServerError(
                "Event doesn't have configuration",
                {
                    statusCode: GONE,
                    shouldCapture: false,
                    extra: {
                        event: JSON.stringify(event)
                    }
                }
            );
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
