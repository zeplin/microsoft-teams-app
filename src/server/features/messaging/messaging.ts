import { messageQueue } from "./messageQueue";
import { messageFacade } from "./messageFacade";
import { Router } from "express";
import { messageRouter } from "./messageRouter";
import { Config } from "../../../config";

export function initMessaging(router: Router, config: Config): void {
    messageQueue.init(config);
    messageQueue.process(job => messageFacade.processJob(job.data));
    router.use("/webhook", messageRouter);
}
