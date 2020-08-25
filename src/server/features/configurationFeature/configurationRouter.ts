import { Router as createRouter } from "express";
import Joi from "@hapi/joi";

import { validateRequest, JSONBodyParser } from "../../middlewares";
import { ProjectWebhookEvent, StyleguideWebhookEvent, WebhookResourceType } from "../../adapters";
import { handleConfigurationCreate, handleConfigurationDelete } from "./configurationController";

const configurationRouter = createRouter({ mergeParams: true });

configurationRouter.post(
    "/",
    JSONBodyParser,
    validateRequest({
        body: Joi.object({
            zeplin: Joi.object({
                resource: Joi.object({
                    id: Joi.string().regex(/^[0-9a-f]{24}$/i),
                    type: Joi.string().valid(...Object.values(WebhookResourceType))
                }),
                events: Joi.when("resource.type", {
                    is: WebhookResourceType.PROJECT,
                    then: Joi.array().items(Joi.string().valid(...Object.values(ProjectWebhookEvent))).unique().min(1),
                    otherwise: Joi.array().items(Joi.valid(...Object.values(StyleguideWebhookEvent))).unique().min(1)
                })
            }),
            microsoftTeams: Joi.object({
                channel: Joi.object({
                    id: Joi.string(),
                    name: Joi.string()
                }),
                tenantId: Joi.string(),
                incomingWebhookUrl: Joi.string().uri()
            })
        })
    }),
    handleConfigurationCreate
);

configurationRouter.delete(
    "/:configurationId",
    validateRequest({
        params: Joi.object({
            configurationId: Joi.string().regex(/^[0-9a-f]{24}$/i)
        })
    }),
    handleConfigurationDelete
);

export {
    configurationRouter
};
