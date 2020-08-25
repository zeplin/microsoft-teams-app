import { Router } from "express";
import { Config } from "../config";
import { initMessagingFeature } from "./messagingFeature";
import { initAuthFeature } from "./authFeature";
import { initWorkspaceFeature } from "./workspaceFeature";
import { initConfigurationFeature } from "./configurationFeature";

export function initFeatures(router: Router, config: Config): void {
    initMessagingFeature(router, config);
    initAuthFeature(router);
    initWorkspaceFeature(router);
    initConfigurationFeature(router);
}
