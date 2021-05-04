import { GONE, UNAUTHORIZED } from "http-status-codes";
import { WebhookEvent } from "@zeplin/sdk";

import { messageQueue, requester, Zeplin } from "../../adapters";
import { configurationRepo, messageJobRepo, webhookEventRepo } from "../../repos";
import { getNotificationHandler } from "./notificationHandlers";
import { ServerError } from "../../errors";
import { WEBHOOK_SECRET } from "../../config";
import { isHandledWebhookEventTypeEnum } from "../../enums";

interface JobData {
    groupingKey: string;
    webhookId: string;
    id: string;
}

interface EventArrivedParams {
    correlationId: string;
    webhookId: string;
    deliveryId: string;
    signature: string;
    deliveryTimestamp: number;
    payload: unknown;
}

const isOlderEventOfSameResource = (a: WebhookEvent, b: WebhookEvent): boolean => {
    if ("id" in a.resource && "id" in b.resource) {
        return a.resource.id === b.resource.id && a.timestamp < b.timestamp;
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
            data.webhookId
        );
        if (!configuration) {
            throw new ServerError("There isn't any incoming webhook URL found for webhook", {
                extra: { data, pivotEvent }
            });
        }

        if (!isHandledWebhookEventTypeEnum(pivotEvent.event)) {
            throw new ServerError("Unknown event", {
                extra: { data, pivotEvent }
            });
        }

        const notificationHandler = getNotificationHandler(pivotEvent.event);
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

    async handleEventArrived({
        correlationId,
        webhookId,
        deliveryId,
        signature,
        deliveryTimestamp,
        payload
    }: EventArrivedParams): Promise<void> {
        if (!Zeplin.Webhooks.verifyEvent({
            signature,
            deliveryTimestamp,
            secret: WEBHOOK_SECRET,
            payload
        })) {
            throw new ServerError(
                "Event is not verified",
                {
                    statusCode: UNAUTHORIZED,
                    shouldCapture: true,
                    extra: {
                        event: JSON.stringify(payload)
                    }
                }
            );
        }
        const event = Zeplin.Webhooks.transformPayloadToWebhookEvent(payload);

        if (!isHandledWebhookEventTypeEnum(event.event)) {
            return;
        }

        const notificationHandler = getNotificationHandler(event.event);
        if (!notificationHandler.shouldHandleEvent(event)) {
            return;
        }

        const groupingKey = notificationHandler.getGroupingKey({
            event,
            webhookId,
            deliveryId
        });

        const configuration = await configurationRepo.getByWebhookId(webhookId);
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

        await messageJobRepo.setGroupActiveJobId(groupingKey, deliveryId);
        await webhookEventRepo.addEventToGroup(groupingKey, event);

        await messageQueue.add(
            {
                id: deliveryId,
                groupingKey,
                webhookId,
                correlationId
            },
            { delay: notificationHandler.delay }
        );
    }
}

export const webhookEventService = new WebhookEventService();
