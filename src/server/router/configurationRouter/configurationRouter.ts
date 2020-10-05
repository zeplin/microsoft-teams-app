import { Router as createRouter } from "express";
import Joi from "@hapi/joi";

import { validateRequest, JSONBodyParser } from "../../middlewares";
import { ProjectWebhookEventType, StyleguideWebhookEventType, WebhookResourceType } from "../../adapters/zeplin/types";
import { configurationService } from "../../services";

const configurationRouter = createRouter({ mergeParams: true });

const zeplinSchema = Joi.object({
    resource: Joi.object({
        id: Joi.string().regex(/^[0-9a-f]{24}$/i),
        type: Joi.string().valid(...Object.values(WebhookResourceType))
    }),
    workspaceId: Joi.string().regex(/^([0-9a-f]{24}|personal)$/i),
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
    async (req, res, next) => {
        try {
            const result = await configurationService.create(
                req.body,
                {
                    authToken: String(req.headers.authorization)
                }
            );
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
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
    async (req, res, next) => {
        try {
            const result = await configurationService.update(
                {
                    configurationId: req.params.configurationId,
                    zeplin: req.body.zeplin
                },
                {
                    authToken: String(req.headers.authorization)
                }
            );
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

configurationRouter.delete(
    "/:configurationId",
    validateRequest({
        params: Joi.object({
            configurationId: Joi.string().regex(/^[0-9a-f]{24}$/i)
        })
    }),
    async (req, res, next) => {
        try {
            const result = await configurationService.delete(
                req.params.configurationId,
                {
                    authToken: String(req.headers.authorization)
                }
            );
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

configurationRouter.get(
    "/:configurationId",
    validateRequest({
        params: Joi.object({
            configurationId: Joi.string().regex(/^[0-9a-f]{24}$/i)
        })
    }),
    async (req, res, next) => {
        try {
            const result = await configurationService.get(
                req.params.configurationId,
                {
                    authToken: String(req.headers.authorization)
                }
            );
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

export {
    configurationRouter
};
