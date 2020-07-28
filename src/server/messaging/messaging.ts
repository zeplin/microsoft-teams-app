import { messageQueue } from "./messageQueue";
import { messageFacade } from "./messageFacade";
import { Router } from "express";
import { messageRouter } from "./messageRouter";

type MessagingConfig = {
    REDIS_URL: string;
}

export function initMessaging(router: Router, config: MessagingConfig): void {
    messageQueue.init({ REDIS_URL: config.REDIS_URL });
    messageQueue.process(job => messageFacade.processJob(job.data));
    router.use("/webhook", messageRouter);
}
