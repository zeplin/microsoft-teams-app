import { Router } from "express";
import { macAppRedirectLinksRouter } from "./macAppRedirectLinksRouter";

export function initMacAppRedirectLinksFeature(router: Router): void {
    router.use("/app-redirect", macAppRedirectLinksRouter);
}
