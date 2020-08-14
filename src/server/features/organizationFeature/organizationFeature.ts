import { Router } from "express";
import { organizationRouter } from "./organizationRouter";

export function initOrganizationFeature(router: Router): void {
    router.use("/organizations", organizationRouter);
}
