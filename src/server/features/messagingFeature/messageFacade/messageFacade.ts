import { MessageJobData, WebhookEvent } from "../messagingTypes";
import { messageQueue } from "../messageQueue";
import { messageJobRepo, messageWebhookEventRepo } from "../messagingRepos";
import { getNotificationHandler } from "./messageFacadeNotificationHandlers";
import { configurationRepo } from "../../../repos";
import { requester } from "../../../adapters/requester";

class MessageFacade {
    async processJob(data: MessageJobData): Promise<void> {
        const activeJobId = await messageJobRepo.getGroupActiveJobId(data.groupingKey);
        if (!activeJobId || data.id !== activeJobId) {
            return;
        }

        const events = await messageWebhookEventRepo.getAndRemoveGroupEvents(data.groupingKey);
        const [pivotEvent] = events;
        if (!pivotEvent) {
            // TODO: Handle error (maybe log in some general error handler)
            throw new Error(`There isn't any event found for the grouping key ${data.groupingKey}`);
        }

        const incomingWebhookURLForEvent = await configurationRepo.getIncomingWebhookURLForWebhook(
            pivotEvent.webhookId
        );
        if (!incomingWebhookURLForEvent) {
            throw new Error(`There isn't any incoming webhook URL found for webhook: ${pivotEvent.webhookId}`);
        }

        const notificationHandler = getNotificationHandler(pivotEvent.payload.event);
        const message = notificationHandler.getTeamsMessage(events);
        // TODO: Make `getTeamsMessage` return a formatted message (probably an object)
        const teamsMessage = { text: message };

        // TODO: Handle errors?
        await requester.post(incomingWebhookURLForEvent, teamsMessage);
    }

    async handleEventArrived(event: WebhookEvent): Promise<void> {
        const notificationHandler = getNotificationHandler(event.payload.event);
        const groupingKey = notificationHandler.getGroupingKey(event);
        const jobId = event.deliveryId;

        const eventHasConfiguration = await configurationRepo.existsForWebhook(event.webhookId);
        if (!eventHasConfiguration) {
            // TODO: Event doesn't have a configuration set (somehow webhook is not deleted when event is deleted)
            // TODO: Where will we handle these errors?
            // TODO: Better error?
            throw new Error("Event doesn't have configuration");
        }

        // TODO: Handle errors (Maybe redis connection is lost)
        await messageJobRepo.setGroupActiveJobId(groupingKey, jobId);
        await messageWebhookEventRepo.addEventToGroup(groupingKey, event);

        await messageQueue.add(
            { id: jobId, groupingKey },
            { delay: notificationHandler.delay }
        );
    }
}

export const messageFacade = new MessageFacade();