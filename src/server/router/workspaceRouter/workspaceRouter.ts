import { Router as createRouter } from "express";

import { workspaceService } from "../../services";
import { projectRouter } from "./project";
import { styleguideRouter } from "./styleguide";

const BEARER_PREFIX_LENGTH = 7;

const workspaceRouter = createRouter({ mergeParams: true });

workspaceRouter.get(
    "/",
    async (req, res, next) => {
        try {
            const result = await workspaceService.list(String(req.headers.authorization).slice(BEARER_PREFIX_LENGTH));
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

workspaceRouter.use(
    "/:workspace/projects",
    projectRouter
);

workspaceRouter.use(
    "/:workspace/styleguides",
    styleguideRouter
);

export {
    workspaceRouter
};
