import { Router as createRouter } from "express";

import { handleStyleguidesGet } from "./styleguideController";

const styleguideRouter = createRouter({ mergeParams: true });
styleguideRouter.get("/", handleStyleguidesGet);

export {
    styleguideRouter
};
