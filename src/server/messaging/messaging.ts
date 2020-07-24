import { messageQueue } from "./messageQueue";
import { messageFacade } from "./messageFacade";
import { MessageJobData } from "./messageTypes";
import { Job } from "bull";

type MessagingConfig = {
    REDIS_URL: string;
}

export function initMessaging(config: MessagingConfig): void {
    messageQueue.init({ REDIS_URL: config.REDIS_URL });
    messageQueue.process((job: Job<MessageJobData>) => messageFacade.processJob(job.data));
}