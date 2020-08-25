import { Router } from "express";
import { configurationRouter } from "./configurationRouter";

export function initConfigurationFeature(router: Router): void {
    router.use("/configurations", configurationRouter);
}
