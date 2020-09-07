import Bull from "bull";

const QUEUE_NAME = "process-events";

type AddOptions = {
    delay: number;
}

interface MessageJobData {
    id: string;
    groupingKey: string;
}

class MessageQueue {
    private bullQueue!: Bull.Queue<MessageJobData>;
    init(url: string): void {
        this.bullQueue = new Bull<MessageJobData>(QUEUE_NAME, url);
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
