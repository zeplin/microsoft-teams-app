import { RequestHandler } from "express";
import { styleguideFacade } from "./styleguideFacade";

export const handleStyleguidesGet: RequestHandler = async (req, res, next) => {
    try {
        const result = await styleguideFacade.list({
            workspace: req.params.workspace,
            authToken: String(req.headers.authorization)
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};
