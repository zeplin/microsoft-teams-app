import { Router as createRouter } from "express";
import Joi from "@hapi/joi";

import { handleAuthorize, handleTokenCreate } from "./authController";
import { JSONBodyParser, validateRequest } from "../../middlewares";

const authRouter = createRouter({ mergeParams: true });

authRouter.get("/authorize", handleAuthorize);

authRouter.post(
    "/token",
    JSONBodyParser,
    validateRequest({
        body: Joi.object({
            code: Joi.string().optional(),
            refreshToken: Joi.string().optional()
        }).xor("code", "refreshToken")
    }),
    handleTokenCreate
);

export {
    authRouter
};
