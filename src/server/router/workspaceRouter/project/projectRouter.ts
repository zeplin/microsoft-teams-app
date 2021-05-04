import Joi from "@hapi/joi";
import { Router as createRouter } from "express";

import { projectService } from "../../../services";
import { validateRequest } from "../../../middlewares";

const BEARER_PREFIX_LENGTH = 7;

const projectRouter = createRouter({ mergeParams: true });

projectRouter.get(
    "/",
    validateRequest({
        params: Joi.object({
            workspace: Joi.string().regex(/^([0-9a-f]{24}|personal)$/i)
        }),
        query: Joi.object({
            channelId: Joi.string()
        })
    }),
    async (req, res, next) => {
        try {
            const result = await projectService.list({
                workspace: req.params.workspace,
                accessToken: String(req.headers.authorization).slice(BEARER_PREFIX_LENGTH),
                channelId: req.query.channelId as string
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
