import { Router as createRouter } from "express";

import { handleProjectsGet } from "./projectController";

const projectRouter = createRouter();
projectRouter.get("/", handleProjectsGet);

export {
    projectRouter
};
