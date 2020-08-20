import { Router as createRouter } from "express";

import { handleStyleguidesGet } from "./styleguideController";

const styleguideRouter = createRouter();
styleguideRouter.get("/", handleStyleguidesGet);

export {
    styleguideRouter
};
