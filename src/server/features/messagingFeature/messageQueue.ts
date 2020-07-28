import Bull from "bull";
import { MessageJobData } from "./messageTypes";
import { Config } from "../../../config";

const QUEUE_NAME = "process-events";

type AddOptions = {
    delay: number;
}

class MessageQueue {
    private bullQueue: Bull.Queue<MessageJobData> | undefined;
    init(config: Config): void {
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
