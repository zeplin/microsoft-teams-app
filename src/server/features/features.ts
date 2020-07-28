import { Router } from "express";
import { Config } from "../../config";
import { initMessaging } from "./messaging";

export function initFeatures(router: Router, config: Config): void {
    initMessaging(router, config);
}
