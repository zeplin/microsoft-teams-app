import { Router as createRouter } from "express";
import { handleWebhookRequest } from "./messageController";
import { JSONBodyParser } from "../../middlewares";

const messageRouter = createRouter();
messageRouter.post("/",
    JSONBodyParser,
    handleWebhookRequest
);

export {
    messageRouter
};
