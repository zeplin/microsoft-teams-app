import { Router as createRouter } from "express";
import Joi from "@hapi/joi";

import { handleAuthorize, handleTokenCreate, handleTokenRefresh } from "./authController";
import { JSONBodyParser, validateRequest } from "../../middlewares";

const authRouter = createRouter({ mergeParams: true });

authRouter.get("/authorize", handleAuthorize);

authRouter.post(
    "/token",
    JSONBodyParser,
    validateRequest({
        body: Joi.object({
            code: Joi.string()
        })
    }),
    handleTokenCreate
);

authRouter.put(
    "/token",
    JSONBodyParser,
    validateRequest({
        body: Joi.object({
            refreshToken: Joi.string()
        })
    }),
    handleTokenRefresh
);

export {
    authRouter
};
