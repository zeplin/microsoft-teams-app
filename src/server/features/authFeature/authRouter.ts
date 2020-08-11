import { Router as createRouter } from "express";
import Joi from "@hapi/joi";

import { handleAuthorize, handleTokenCreate } from "./authController";
import { JSONBodyParser, validateRequest } from "../../middlewares";

const authRouter = createRouter();
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

export {
    authRouter
};
