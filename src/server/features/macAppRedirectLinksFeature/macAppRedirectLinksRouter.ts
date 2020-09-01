import { Router as createRouter } from "express";
import { handleMacAppRedirectLink } from "./macAppRedirectLinksController";
import { validateRequest } from "../../middlewares";
import { ZEPLIN_MAC_APP_URL_SCHEME } from "../../config";
import Joi from "@hapi/joi";

const macAppRedirectLinksRouter = createRouter({ mergeParams: true });

macAppRedirectLinksRouter.get(
    "/",
    validateRequest({
        query: Joi.object({
            uri: Joi.string().uri({ scheme: ZEPLIN_MAC_APP_URL_SCHEME }).required()
        })
    }),
    handleMacAppRedirectLink
);

export {
    macAppRedirectLinksRouter
};