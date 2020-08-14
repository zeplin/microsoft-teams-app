import { Router as createRouter } from "express";

import { handleOrganizationsGet } from "./organizationController";

const organizationRouter = createRouter();
organizationRouter.get("/", handleOrganizationsGet);

export {
    organizationRouter
};
