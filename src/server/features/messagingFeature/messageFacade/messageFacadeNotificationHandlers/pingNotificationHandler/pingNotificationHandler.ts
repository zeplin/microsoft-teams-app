import { NotificationHandler } from "../NotificationHandler";
import { ServerError } from "../../../../../errors";

class PingNotificationHandler extends NotificationHandler {
    delay = 0;

    shouldHandleEvent(): false {
        return false;
    }

    getTeamsMessage(): never {
        throw new ServerError("Unreachable code");
    }
}

export const pingNotificationHandler = new PingNotificationHandler();
