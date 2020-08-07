import { MessageJobData, WebhookEvent } from "../messagingTypes";
import { messageQueue } from "../messageQueue";
import { messageJobRepo, messageWebhookEventRepo } from "../messagingRepos";
import { getNotificationHandler } from "./messageFacadeNotificationHandlers";

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

        // TODO: Check configuration id etc.
        const notificationHandler = getNotificationHandler(pivotEvent.payload.event);
        const message = notificationHandler.getTeamsMessage(events);
        // eslint-disable-next-line no-console
        console.log(message);
    }

    async handleEventArrived(event: WebhookEvent): Promise<void> {
        const notificationHandler = getNotificationHandler(event.payload.event);
        const groupingKey = notificationHandler.getGroupingKey(event);
        const jobId = event.deliveryId;

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