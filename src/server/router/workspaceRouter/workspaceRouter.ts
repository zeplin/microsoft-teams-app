import { Router as createRouter } from "express";
import Joi from "@hapi/joi";

import { validateRequest } from "../../middlewares";
import { workspaceService } from "../../services";
import { projectRouter } from "./project";
import { styleguideRouter } from "./styleguide";

const workspaceRouter = createRouter({ mergeParams: true });

workspaceRouter.get(
    "/",
    async (req, res, next) => {
        try {
            const result = await workspaceService.list(String(req.headers.authorization));
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

workspaceRouter.use(
    "/:workspace/projects",
    validateRequest({
        params: Joi.object({
            workspace: Joi.string().regex(/^([0-9a-f]{24}|personal)$/i)
        })
    }),
    projectRouter
);

workspaceRouter.use(
    "/:workspace/styleguides",
    validateRequest({
        params: Joi.object({
            workspace: Joi.string().regex(/^([0-9a-f]{24}|personal)$/i)
        })
    }),
    styleguideRouter
);

export {
    workspaceRouter
};