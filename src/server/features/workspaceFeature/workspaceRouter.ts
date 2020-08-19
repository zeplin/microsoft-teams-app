import { Router as createRouter } from "express";

import { handleWorkspacesGet } from "./workspaceController";

const workspaceRouter = createRouter();
workspaceRouter.get("/", handleWorkspacesGet);

export {
    workspaceRouter
};
