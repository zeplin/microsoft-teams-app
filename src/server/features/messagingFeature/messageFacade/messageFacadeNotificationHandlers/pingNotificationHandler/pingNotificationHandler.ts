import { NotificationHandler } from "../NotificationHandler";
import { ServiceError } from "../../../../../errors";

class PingNotificationHandler extends NotificationHandler {
    delay = 0;

    shouldHandleEvent(): false {
        return false;
    }

    getTeamsMessage(): never {
        throw new ServiceError("Unreachable code");
    }
}

export const pingNotificationHandler = new PingNotificationHandler();
