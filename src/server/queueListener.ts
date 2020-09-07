import { messageQueue, sentry } from "./adapters";
import { webhookEventService } from "./services";

export async function initializeQueueListener(): Promise<void> {
    await messageQueue.process(async job => {
        try {
            await webhookEventService.processJob(job.data);
        } catch (err) {
            sentry.captureException(err);
        }
    });
}
