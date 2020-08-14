import { Router as createRouter } from "express";
import { handleWebhookRequest } from "./messageController";
import { handleError, JSONBodyParser } from "../../middlewares";

const messageRouter = createRouter();
messageRouter.post("/",
    JSONBodyParser,
    handleWebhookRequest,
    handleError
);

export {
    messageRouter
};
