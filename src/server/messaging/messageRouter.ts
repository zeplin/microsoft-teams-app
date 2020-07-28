import { Router as createRouter } from "express";
import { handleWebhookRequest } from "./messageController";

const messageRouter = createRouter();
messageRouter.get("/", handleWebhookRequest);

export {
    messageRouter
};
