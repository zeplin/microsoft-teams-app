import { Router as createRouter } from "express";
import { meService } from "../../services";

const BEARER_PREFIX_LENGTH = 7;

const meRouter = createRouter({ mergeParams: true });

meRouter.get("/",
    async (req, res, next) => {
        try {
            const result = await meService.get(String(req.headers.authorization).slice(BEARER_PREFIX_LENGTH));
            res.send(result);
        } catch (error) {
            next(error);
        }
    }
);

export {
    meRouter
};
