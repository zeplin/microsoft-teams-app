import { Router as createRouter } from "express";
import { handleMacAppRedirectLink } from "./macAppRedirectLinksController";
import { validateRequest } from "../../middlewares";
import Joi from "@hapi/joi";

const macAppRedirectLinksRouter = createRouter({ mergeParams: true });

macAppRedirectLinksRouter.get(
    "/",
    validateRequest({
        query: Joi.object({
            uri: Joi.string().uri({ scheme: "zpl" }).required()
        })
    }),
    handleMacAppRedirectLink
);

export {
    macAppRedirectLinksRouter
};