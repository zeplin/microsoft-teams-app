import { Router as createRouter } from "express";
import { handleWebhookRequest } from "./messageController";
import { JSONBodyParser } from "../../middlewares";

const messageRouter = createRouter({ mergeParams: true });
messageRouter.post("/",
    JSONBodyParser,
    handleWebhookRequest
);

export {
    messageRouter
};
