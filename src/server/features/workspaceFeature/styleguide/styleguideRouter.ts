import { Router as createRouter } from "express";

import { styleguideFacade } from "./styleguideFacade";

const styleguideRouter = createRouter({ mergeParams: true });

styleguideRouter.get(
    "/",
    async (req, res, next) => {
        try {
            const result = await styleguideFacade.list({
                workspace: req.params.workspace,
                authToken: String(req.headers.authorization)
            });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

export {
    styleguideRouter
};
