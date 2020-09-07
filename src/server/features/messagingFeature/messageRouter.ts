import { Router as createRouter } from "express";
import { JSONBodyParser } from "../../middlewares";
import { webhookEventService } from "../../services";

const messageRouter = createRouter({ mergeParams: true });
messageRouter.post("/",
    JSONBodyParser,
    async (req, res, next) => {
        try {
            const webhookId = req.headers["zeplin-webhook-id"] as string;
            const deliveryId = req.headers["zeplin-delivery-id"] as string;
            await webhookEventService.handleEventArrived({
                webhookId,
                deliveryId,
                payload: req.body
            });
            res.send();
        } catch (error) {
            next(error);
        }
    }
);

export {
    messageRouter
};
