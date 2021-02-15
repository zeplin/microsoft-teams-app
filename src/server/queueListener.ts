import { messageQueue, sentry } from "./adapters";
import { webhookEventService } from "./services";
import { logger } from "./adapters/logger";

export async function initializeQueueListener(): Promise<void> {
    await messageQueue.process(async ({ data, id }) => {
        try {
            await webhookEventService.processJob(data);
            logger.info(
                "Job processed",
                {
                    meta: {
                        data,
                        id
                    }
                }
            );
        } catch (err) {
            sentry.captureException(err);
        }
    });
}
