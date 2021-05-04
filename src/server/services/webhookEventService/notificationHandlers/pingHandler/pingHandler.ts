import { PingEvent } from "@zeplin/sdk";

import { NotificationHandler } from "../NotificationHandler";
import { ServerError } from "../../../../errors";

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
