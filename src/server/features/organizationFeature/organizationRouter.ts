import { Router as createRouter } from "express";

import { handleOrganizationsGet } from "./organizationController";
import { handleError } from "../../middlewares/handleError";

const organizationRouter = createRouter();
organizationRouter.get("/", handleOrganizationsGet, handleError);

export {
    organizationRouter
};
