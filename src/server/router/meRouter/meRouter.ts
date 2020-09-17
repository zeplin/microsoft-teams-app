import { Router as createRouter } from "express";
import { meService } from "../../services";

const meRouter = createRouter({ mergeParams: true });

meRouter.get("/",
    async (req, res, next) => {
        try {
            const result = await meService.get(req.headers.authorization as string);
            res.send(result);
        } catch (error) {
            next(error);
        }
    }
);

export {
    meRouter
};
