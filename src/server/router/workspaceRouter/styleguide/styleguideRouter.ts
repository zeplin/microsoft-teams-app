import { Router as createRouter } from "express";

import { styleguideService } from "../../../services";

const styleguideRouter = createRouter({ mergeParams: true });

styleguideRouter.get(
    "/",
    async (req, res, next) => {
        try {
            const result = await styleguideService.list({
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
