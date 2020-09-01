import { messageQueue } from "./messageQueue";
import { messageFacade } from "./messageFacade";
import { Router } from "express";
import { messageRouter } from "./messageRouter";
import { Config } from "../../config";
import { sentry } from "../../adapters";

export function initMessagingFeature(router: Router, config: Config): void {
    messageQueue.init(config);
    messageQueue.process(async job => {
        try {
            await messageFacade.processJob(job.data);
        } catch (err) {
            sentry.captureException(err);
        }
    });
    router.use("/webhook", messageRouter);
}
