import { Router as createRouter } from "express";

import { handleProjectsGet } from "./projectController";

const projectRouter = createRouter({ mergeParams: true });
projectRouter.get("/", handleProjectsGet);

export {
    projectRouter
};
