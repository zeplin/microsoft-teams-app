import { Router as createRouter } from "express";
import Joi from "@hapi/joi";
import { ProjectWebhookEventEnum, StyleguideWebhookEventEnum } from "@zeplin/sdk";

import { validateRequest, JSONBodyParser } from "../../middlewares";
import { WebhookResourceTypeEnum } from "../../enums";
import { configurationService } from "../../services";

const BEARER_PREFIX_LENGTH = 7;

const configurationRouter = createRouter({ mergeParams: true });

const zeplinSchema = Joi.object({
    resource: Joi.object({
        id: Joi.string().regex(/^[0-9a-f]{24}$/i),
        type: Joi.string().valid(...Object.values(WebhookResourceTypeEnum))
    }),
    workspaceId: Joi.string().regex(/^([0-9a-f]{24}|personal)$/i),
    events: Joi.when("resource.type", {
        is: WebhookResourceTypeEnum.PROJECT,
        then: Joi.array().items(Joi.string().valid(...Object.values(ProjectWebhookEventEnum))).unique().min(1),
        otherwise: Joi.array().items(Joi.valid(...Object.values(StyleguideWebhookEventEnum))).unique().min(1)
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
                    accessToken: String(req.headers.authorization).slice(BEARER_PREFIX_LENGTH)
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
                    accessToken: String(req.headers.authorization).slice(BEARER_PREFIX_LENGTH)
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
                    accessToken: String(req.headers.authorization).slice(BEARER_PREFIX_LENGTH)
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
                    accessToken: String(req.headers.authorization).slice(BEARER_PREFIX_LENGTH)
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
