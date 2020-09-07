import { Router as createRouter } from "express";
import Joi from "@hapi/joi";

import { JSONBodyParser, validateRequest } from "../../middlewares";
import { authService } from "../../services";

const authRouter = createRouter({ mergeParams: true });

authRouter.get(
    "/authorize",
    (req, res, next) => {
        try {
            res.redirect(authService.getAuthorizationUrl());
        } catch (error) {
            next(error);
        }
    });

authRouter.post(
    "/token",
    JSONBodyParser,
    validateRequest({
        body: Joi.object({
            code: Joi.string().optional(),
            refreshToken: Joi.string().optional()
        }).xor("code", "refreshToken")
    }),
    async (req, res, next) => {
        try {
            const result = await authService.createToken(req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

export {
    authRouter
};
