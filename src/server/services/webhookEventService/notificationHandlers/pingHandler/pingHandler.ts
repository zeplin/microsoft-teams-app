import { NotificationHandler } from "../NotificationHandler";
import { ServerError } from "../../../../errors";
import { PingEvent } from "../../../../adapters/zeplin/types";

class PingHandler extends NotificationHandler<PingEvent> {
    delay = 0;

    shouldHandleEvent(): false {
        return false;
    }

    getTeamsMessage(): never {
        throw new ServerError("Unreachable code");
    }
}

export const pingHandler = new PingHandler();
