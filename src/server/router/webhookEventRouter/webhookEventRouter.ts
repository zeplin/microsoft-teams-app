import { Router as createRouter } from "express";
import { JSONBodyParser } from "../../middlewares";
import { webhookEventService } from "../../services";

const webhookEventRouter = createRouter({ mergeParams: true });
webhookEventRouter.post("/",
    JSONBodyParser,
    async (req, res, next) => {
        try {
            const webhookId = req.headers["zeplin-webhook-id"] as string;
            const deliveryId = req.headers["zeplin-delivery-id"] as string;
            const signature = req.headers["zeplin-signature"] as string;
            const deliveryTimestamp = Number(req.headers["zeplin-delivery-timestamp"]);
            await webhookEventService.handleEventArrived({
                webhookId,
                deliveryId,
                signature,
                deliveryTimestamp,
                payload: req.body
            });
            res.send();
        } catch (error) {
            next(error);
        }
    }
);

export {
    webhookEventRouter
};
