import { MessageJobData } from "./messageTypes";
import { messageQueue } from "./messageQueue";

type HandleEventArrivedOptions = {
    delay: number;
}

class MessageFacade {
    async processJob(data: MessageJobData): Promise<void> {
        await Promise.resolve();
        console.log(data);
    }

    handleEventArrived(data: MessageJobData, { delay }: HandleEventArrivedOptions): Promise<void> {
        return messageQueue.add(data, { delay });
    }
}

export const messageFacade = new MessageFacade();