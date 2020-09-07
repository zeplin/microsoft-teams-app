import { messageQueue, sentry } from "../../adapters";
import { webhookEventService } from "../../services";
import { Router } from "express";
import { webhookEventRouter } from "./webhookEventRouter";
import { Config } from "../../config";

export function initMessagingFeature(router: Router, config: Config): void {
    messageQueue.init(config);
    messageQueue.process(async job => {
        try {
            await webhookEventService.processJob(job.data);
        } catch (err) {
            sentry.captureException(err);
        }
    });
    router.use("/webhook", webhookEventRouter);
}
