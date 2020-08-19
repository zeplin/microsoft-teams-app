import { NotificationHandler } from "../NotificationHandler";

class PingNotificationHandler extends NotificationHandler {
    delay = 0;

    shouldHandleEvent(): false {
        return false;
    }

    getTeamsMessage(): never {
        throw new Error("Unreachable code");
    }
}

export const pingNotificationHandler = new PingNotificationHandler();
