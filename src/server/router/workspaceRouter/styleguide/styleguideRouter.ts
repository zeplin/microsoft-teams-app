import { Router as createRouter } from "express";

import { styleguideService } from "../../../services";
import { validateRequest } from "../../../middlewares/validateRequest";
import Joi from "@hapi/joi";

const styleguideRouter = createRouter({ mergeParams: true });

styleguideRouter.get(
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
            const result = await styleguideService.list({
                workspace: req.params.workspace,
                accessToken: req.headers.authorization as string,
                channelId: req.query.channelId as string
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
