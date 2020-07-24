import { MessageJobData, WebhookEvent } from "./messageTypes";
import { messageQueue } from "./messageQueue";
import { messageJobRepo } from "./messagingRepos";
import { messageWebhookEventRepo } from "./messagingRepos/messageWebhookEventRepo";

function getGroupingKey(event: WebhookEvent): string {
    return `${event.webhookId}:others`;
}

class MessageFacade {
    async processJob(data: MessageJobData): Promise<void> {
        const groupJobId = await messageJobRepo.getGroupJobId(data.groupingKey);
        if (!groupJobId || data.id !== groupJobId) {
            return;
        }

        const events = await messageWebhookEventRepo.getAndRemoveGroupEvents(data.groupingKey);
        console.log(events);
    }

    async handleEventArrived(event: WebhookEvent): Promise<void> {
        const groupingKey = getGroupingKey(event);
        const jobId = event.deliveryId;

        await messageJobRepo.setGroupJobId(groupingKey, jobId);
        await messageWebhookEventRepo.addEventToGroup(groupingKey, event);

        // TODO: Get delay depending on the webhook event
        await messageQueue.add({ id: jobId, groupingKey }, { delay: 5000 });
    }
}

export const messageFacade = new MessageFacade();