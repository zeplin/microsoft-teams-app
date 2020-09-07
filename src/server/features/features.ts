import { Router } from "express";
import { initMessagingFeature } from "./webhookEventFeature";
import { initAuthFeature } from "./authFeature";
import { initWorkspaceFeature } from "./workspaceFeature";
import { initConfigurationFeature } from "./configurationFeature";
import { initMacAppRedirectLinksFeature } from "./macAppRedirectLinksFeature";

export function initFeatures(router: Router): void {
    initMessagingFeature(router);
    initAuthFeature(router);
    initWorkspaceFeature(router);
    initConfigurationFeature(router);
    initMacAppRedirectLinksFeature(router);
}
