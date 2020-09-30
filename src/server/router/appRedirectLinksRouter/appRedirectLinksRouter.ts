import { Router as createRouter } from "express";
import { validateRequest } from "../../middlewares";
import { ZEPLIN_APP_URI_SCHEME } from "../../config";
import Joi from "@hapi/joi";
import { PERMANENT_REDIRECT } from "http-status-codes";

const appRedirectLinksRouter = createRouter({ mergeParams: true });

appRedirectLinksRouter.get(
    "/",
    validateRequest({
        query: Joi.object({
            uri: Joi.string().uri({ scheme: ZEPLIN_APP_URI_SCHEME }).required()
        })
    }),
    (req, res) => {
        res.redirect(PERMANENT_REDIRECT, req.query.uri as string);
    }
);

export {
    appRedirectLinksRouter
};
