import { Router } from "express";
import { Config } from "../config";
import { initMessagingFeature } from "./messagingFeature";
import { initAuthFeature } from "./authFeature";
import { initOrganizationFeature } from "./organizationFeature";

export function initFeatures(router: Router, config: Config): void {
    initMessagingFeature(router, config);
    initAuthFeature(router);
    initOrganizationFeature(router);
}
