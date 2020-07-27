import Bull from "bull";
import { MessageJobData } from "./messageTypes";

const QUEUE_NAME = "process-events";

type MessageQueueConfig = {
    REDIS_URL: string;
}

type AddOptions = {
    delay: number;
}

class MessageQueue {
    private bullQueue: Bull.Queue<MessageJobData> | undefined;
    init(config: MessageQueueConfig): void {
        this.bullQueue = new Bull<MessageJobData>(QUEUE_NAME, config.REDIS_URL);
    }

    process(handler: Bull.ProcessCallbackFunction<MessageJobData>): Promise<void> {
        return this.bullQueue.process(handler);
    }

    async add(data: MessageJobData, { delay }: AddOptions): Promise<void> {
        await this.bullQueue.add(data, {
            delay
        });
    }
}

export const messageQueue = new MessageQueue();