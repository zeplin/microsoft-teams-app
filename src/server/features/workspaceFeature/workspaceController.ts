import { RequestHandler } from "express";
import { workspaceFacade } from "./workspaceFacade";

export const handleWorkspacesGet: RequestHandler = async (req, res, next) => {
    try {
        const result = await workspaceFacade.list(String(req.headers.authorization));
        res.json(result);
    } catch (error) {
        next(error);
    }
};
