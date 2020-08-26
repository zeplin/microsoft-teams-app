import { RequestHandler } from "express";
import { configurationFacade } from "./configurationFacade";

export const handleConfigurationCreate: RequestHandler = async (req, res, next) => {
    try {
        const result = await configurationFacade.create(
            req.body,
            {
                authToken: String(req.headers.authorization)
            }
        );
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const handleConfigurationDelete: RequestHandler = async (req, res, next) => {
    try {
        const result = await configurationFacade.delete(
            req.params.configurationId,
            String(req.headers.authorization)
        );
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const handleConfigurationGet: RequestHandler = async (req, res, next) => {
    try {
        const result = await configurationFacade.get(
            req.params.configurationId,
            String(req.headers.authorization)
        );
        res.json(result);
    } catch (error) {
        next(error);
    }
};
