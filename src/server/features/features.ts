import { Router } from "express";
import { Config } from "../../config";
import { initMessagingFeature } from "./messagingFeature";

export function initFeatures(router: Router, config: Config): void {
    initMessagingFeature(router, config);
}
