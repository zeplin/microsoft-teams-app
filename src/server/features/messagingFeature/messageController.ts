import { Request, Response } from "express";
import { messageFacade } from "./messageFacade";

export async function handleWebhookRequest(req: Request, res: Response): Promise<void> {
    const webhookId = req.headers["Zeplin-Webhook-Id"] as string;
    const deliveryId = req.headers["Zeplin-Delivery-Id"] as string;
    await messageFacade.handleEventArrived({
        webhookId,
        deliveryId,
        payload: req.body
    });
    res.send();
}