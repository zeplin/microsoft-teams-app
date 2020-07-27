import { messageQueue } from "./messageQueue";
import { messageFacade } from "./messageFacade";

type MessagingConfig = {
    REDIS_URL: string;
}

export function initMessaging(config: MessagingConfig): void {
    messageQueue.init({ REDIS_URL: config.REDIS_URL });
    messageQueue.process(job => messageFacade.processJob(job.data));
}