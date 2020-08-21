import { Router as createRouter } from "express";
import Joi from "@hapi/joi";

import { validateRequest } from "../../middlewares";
import { handleWorkspacesGet } from "./workspaceController";
import { projectRouter } from "./project";
import { styleguideRouter } from "./styleguide";

const workspaceRouter = createRouter({ mergeParams: true });
workspaceRouter.get("/", handleWorkspacesGet);
workspaceRouter.use(
    "/:workspace/projects",
    validateRequest({
        params: Joi.object({
            workspace: Joi.string().regex(/^([0-9a-f]{24}|personal)$/i)
        })
    }),
    projectRouter
);
workspaceRouter.use(
    "/:workspace/styleguides",
    validateRequest({
        params: Joi.object({
            workspace: Joi.string().regex(/^([0-9a-f]{24}|personal)$/i)
        })
    }),
    styleguideRouter
);

export {
    workspaceRouter
};
