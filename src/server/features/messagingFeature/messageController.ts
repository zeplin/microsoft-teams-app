import { RequestHandler } from "express";
import { messageFacade } from "./messageFacade";

export const handleWebhookRequest: RequestHandler = async (req, res, next) => {
    try {
        const webhookId = req.headers["Zeplin-Webhook-Id"] as string;
        const deliveryId = req.headers["Zeplin-Delivery-Id"] as string;
        await messageFacade.handleEventArrived({
            webhookId,
            deliveryId,
            payload: req.body
        });
        res.send();
    } catch (error) {
        next(error);
    }
};
