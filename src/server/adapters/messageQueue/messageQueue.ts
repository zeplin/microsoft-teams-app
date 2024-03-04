import Bull from "bull";
import { logger } from "../logger";

const QUEUE_NAME = "process-events";

type AddOptions = {
    delay: number;
}

interface MessageJobData {
    id: string;
    groupingKey: string;
    webhookId: string;
    correlationId: string;
}

class MessageQueue {
    private bullQueue!: Bull.Queue<MessageJobData>;
    init(url: string): void {
        this.bullQueue = new Bull<MessageJobData>(QUEUE_NAME, url);
        logger.info("MessageQueue is initialized.");
    }

    process(handler: Bull.ProcessCallbackFunction<MessageJobData>): Promise<void> {
        return this.bullQueue.process(handler);
    }

    async add(data: MessageJobData, { delay }: AddOptions): Promise<void> {
        await this.bullQueue.add(data, { delay, removeOnComplete: true });
    }

    async close(): Promise<void> {
        await this.bullQueue.close();
    }
}

export const messageQueue = new MessageQueue();
