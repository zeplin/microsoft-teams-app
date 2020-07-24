import { Request, Response } from "express";
import { messageFacade } from "./messageFacade";

export async function handleWebhookRequest(req: Request, res: Response): Promise<void> {
    await messageFacade.handleEventArrived({ id: req.url }, { delay: 1000 });
    res.json({ url: req.url });
}