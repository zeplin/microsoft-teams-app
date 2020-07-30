import { MessageJobData, WebhookEvent } from "../messageTypes";
import { messageQueue } from "../messageQueue";
import { messageJobRepo, messageWebhookEventRepo } from "../messagingRepos";

function getGroupingKey(event: WebhookEvent): string {
    return `${event.webhookId}:others`;
}

class MessageFacade {
    async processJob(data: MessageJobData): Promise<void> {
        const activeJobId = await messageJobRepo.getGroupActiveJobId(data.groupingKey);
        if (!activeJobId || data.id !== activeJobId) {
            return;
        }

        const events = await messageWebhookEventRepo.getAndRemoveGroupEvents(data.groupingKey);
        // eslint-disable-next-line no-console
        console.log(events);
    }

    async handleEventArrived(event: WebhookEvent): Promise<void> {
        const groupingKey = getGroupingKey(event);
        const jobId = event.deliveryId;

        // TODO: Handle errors (Maybe redis connection is lost)
        await messageJobRepo.setGroupActiveJobId(groupingKey, jobId);
        await messageWebhookEventRepo.addEventToGroup(groupingKey, event);

        // TODO: Get delay depending on the webhook event
        await messageQueue.add({ id: jobId, groupingKey }, { delay: 5000 });
    }
}

export const messageFacade = new MessageFacade();