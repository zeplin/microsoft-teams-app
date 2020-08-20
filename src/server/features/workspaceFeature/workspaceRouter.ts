import { Router as createRouter } from "express";
import Joi from "@hapi/joi";

import { validateRequest } from "../../middlewares";
import { handleWorkspacesGet } from "./workspaceController";
import { projectRouter } from "./project";
import { styleguideRouter } from "./styleguide";

const workspaceRouter = createRouter();
workspaceRouter.get("/", handleWorkspacesGet);
workspaceRouter.use(
    "/:workspaceId/projects",
    validateRequest({
        params: Joi.object({
            workspaceId: Joi.string().regex(/^([0-9a-f]{24}|personal)$/i)
        })
    }),
    projectRouter
);
workspaceRouter.use(
    "/:workspaceId/styleguides",
    validateRequest({
        params: Joi.object({
            workspaceId: Joi.string().regex(/^([0-9a-f]{24}|personal)$/i)
        })
    }),
    styleguideRouter
);

export {
    workspaceRouter
};
