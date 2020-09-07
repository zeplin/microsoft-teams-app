import { Router as createRouter } from "express";

import { projectFacade } from "./projectFacade";

const projectRouter = createRouter({ mergeParams: true });

projectRouter.get(
    "/",
    async (req, res, next) => {
        try {
            const result = await projectFacade.list({
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
    projectRouter
};
