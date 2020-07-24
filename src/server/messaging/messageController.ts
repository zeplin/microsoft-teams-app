import { Request, Response } from "express";
import { messageFacade } from "./messageFacade";

export async function handleWebhookRequest(req: Request, res: Response): Promise<void> {
    await messageFacade.handleEventArrived({
        webhookId: "webhookId",
        deliveryId: `delivery_${Math.random()}`,
        payload: {
            event: "project.screen.version",
            action: "created",
            resource: {
                id: req.url,
                type: "ScreenVersion"
            },
            context: {
                project: {
                    id: "project_id"
                }
            }
        }
    });

    res.json({ url: req.url });
}