import { Router as createRouter } from "express";
import Joi from "@hapi/joi";

import { validateRequest, JSONBodyParser } from "../../middlewares";
import { ProjectWebhookEventType, StyleguideWebhookEventType, WebhookResourceType } from "../../adapters/zeplin/types";
import {
    handleConfigurationCreate,
    handleConfigurationDelete,
    handleConfigurationGet,
    handleConfigurationUpdate
} from "./configurationController";

const configurationRouter = createRouter({ mergeParams: true });

const zeplinSchema = Joi.object({
    resource: Joi.object({
        id: Joi.string().regex(/^[0-9a-f]{24}$/i),
        type: Joi.string().valid(...Object.values(WebhookResourceType))
    }),
    events: Joi.when("resource.type", {
        is: WebhookResourceType.PROJECT,
        then: Joi.array().items(Joi.string().valid(...Object.values(ProjectWebhookEventType))).unique().min(1),
        otherwise: Joi.array().items(Joi.valid(...Object.values(StyleguideWebhookEventType))).unique().min(1)
    })
});

configurationRouter.post(
    "/",
    JSONBodyParser,
    validateRequest({
        body: Joi.object({
            zeplin: zeplinSchema,
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

configurationRouter.put(
    "/:configurationId",
    JSONBodyParser,
    validateRequest({
        params: Joi.object({
            configurationId: Joi.string().regex(/^[0-9a-f]{24}$/i)
        }),
        body: Joi.object({
            zeplin: zeplinSchema
        })
    }),
    handleConfigurationUpdate
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

configurationRouter.get(
    "/:configurationId",
    validateRequest({
        params: Joi.object({
            configurationId: Joi.string().regex(/^[0-9a-f]{24}$/i)
        })
    }),
    handleConfigurationGet
);

export {
    configurationRouter
};
