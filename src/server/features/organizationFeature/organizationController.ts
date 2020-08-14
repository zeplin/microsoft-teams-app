import { RequestHandler } from "express";
import { organizationFacade } from "./organizationFacade";

export const handleOrganizationsGet: RequestHandler = async (req, res, next) => {
    try {
        const result = await organizationFacade.findAll(String(req.headers.authorization));
        res.json(result);
    } catch (error) {
        next(error);
    }
};
