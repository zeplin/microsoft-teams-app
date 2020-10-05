import { Router as createRouter } from "express";

import { authRouter } from "./authRouter";
import { configurationRouter } from "./configurationRouter";
import { webhookEventRouter } from "./webhookEventRouter";
import { workspaceRouter } from "./workspaceRouter";
import { meRouter } from "./meRouter";

const router = createRouter({ mergeParams: true });

router.use("/auth", authRouter);
router.use("/configurations", configurationRouter);
router.use("/webhook", webhookEventRouter);
router.use("/workspaces", workspaceRouter);
router.use("/me", meRouter);

export {
    router
};
