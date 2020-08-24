import { RequestHandler } from "express";
import { projectFacade } from "./projectFacade";

export const handleProjectsGet: RequestHandler = async (req, res, next) => {
    try {
        const result = await projectFacade.list({
            workspace: req.params.workspace,
            authToken: String(req.headers.authorization)
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
};