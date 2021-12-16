import { messageQueue, logger, loggerContext } from "./adapters";
import { webhookEventService } from "./services";
import { ServerError } from "./errors";

export async function initializeQueueListener(): Promise<void> {
    await messageQueue.process(
        ({ data, id }) => (
            loggerContext.run(
                { correlationId: data.correlationId },
                async () => {
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
                    } catch (error) {
                        logger.error(ServerError.fromUnknown(error));
                    }
                }
            )
        )
    );
}
