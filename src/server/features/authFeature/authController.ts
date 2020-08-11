import { Response } from "express";
import { authFacade } from "./authFacade";

export function handleAuthorize(req, res: Response): void {
    res.redirect(authFacade.getAuthorizationUrl());
}

export async function handleTokenCreate(req, res: Response): Promise<void> {
    const result = await authFacade.createToken(req.body.code);
    res.json(result);
}
