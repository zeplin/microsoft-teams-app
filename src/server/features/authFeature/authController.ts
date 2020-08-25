import { RequestHandler } from "express";
import { authFacade } from "./authFacade";

export const handleAuthorize: RequestHandler = (req, res, next) => {
    try {
        res.redirect(authFacade.getAuthorizationUrl());
    } catch (error) {
        next(error);
    }
};

export const handleTokenCreate: RequestHandler = async (req, res, next) => {
    try {
        const result = await authFacade.createToken(req.body.code);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
