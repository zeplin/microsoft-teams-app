import { Router } from "express";
import { webhookEventRouter } from "./webhookEventRouter";

export function initMessagingFeature(router: Router): void {
    router.use("/webhook", webhookEventRouter);
}
