import { Router as createRouter } from "express";
import { JSONBodyParser } from "../../middlewares";
import { webhookEventService } from "../../services";
import { logger } from "../../adapters";

const webhookEventRouter = createRouter({ mergeParams: true });
webhookEventRouter.post("/",
    JSONBodyParser,
    async (req, res, next) => {
        try {
            logger.info("webhookEvent post request received.");
            const webhookId = req.headers["zeplin-webhook-id"] as string;
            const deliveryId = req.headers["zeplin-delivery-id"] as string;
            const signature = req.headers["zeplin-signature"] as string;
            const correlationId = req.headers["zeplin-correlation-id"] as string;
            const deliveryTimestamp = Number(req.headers["zeplin-delivery-timestamp"]);
            await webhookEventService.handleEventArrived({
                correlationId,
                webhookId,
                deliveryId,
                signature,
                deliveryTimestamp,
                payload: req.body
            });
            logger.info("webhookEvent post request handled.");
            res.send();
        } catch (error) {
            next(error);
        }
    }
);

export {
    webhookEventRouter
};
