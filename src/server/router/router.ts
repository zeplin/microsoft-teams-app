import { Router as createRouter } from "express";

import { authRouter } from "./authRouter";
import { configurationRouter } from "./configurationRouter";
import { macAppRedirectLinksRouter } from "./macAppRedirectLinksRouter";
import { webhookEventRouter } from "./webhookEventRouter";
import { workspaceRouter } from "./workspaceRouter";

const router = createRouter({ mergeParams: true });

router.use("/auth", authRouter);
router.use("/configurations", configurationRouter);
router.use("/app-redirect", macAppRedirectLinksRouter);
router.use("/webhook", webhookEventRouter);
router.use("/workspaces", workspaceRouter);

export {
    router
};
