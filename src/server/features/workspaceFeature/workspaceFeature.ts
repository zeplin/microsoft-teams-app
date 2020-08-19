import { Router } from "express";
import { workspaceRouter } from "./workspaceRouter";

export function initWorkspaceFeature(router: Router): void {
    router.use("/workspaces", workspaceRouter);
}
