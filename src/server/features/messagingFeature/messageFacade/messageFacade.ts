import { MessageJobData, WebhookEvent } from "../messagingTypes";
import { messageQueue } from "../messageQueue";
import { messageJobRepo, messageWebhookEventRepo } from "../messagingRepos";
import { getNotificationHandler } from "./messageFacadeNotificationHandlers";
import { configurationRepo } from "../../../repos";
import { requester } from "../../../adapters/requester";
import { ServerError } from "../../../errors";

class MessageFacade {
    async processJob(data: MessageJobData): Promise<void> {
        const activeJobId = await messageJobRepo.getGroupActiveJobId(data.groupingKey);
        if (!activeJobId || data.id !== activeJobId) {
            return;
        }

        const events = await messageWebhookEventRepo.getAndRemoveGroupEvents(data.groupingKey);
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
        const message = notificationHandler.getTeamsMessage(events);
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
        await messageWebhookEventRepo.addEventToGroup(groupingKey, event);

        await messageQueue.add(
            { id: jobId, groupingKey },
            { delay: notificationHandler.delay }
        );
    }
}

export const messageFacade = new MessageFacade();
