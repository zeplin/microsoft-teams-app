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
            {
                authToken: String(req.headers.authorization)
            }
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
            {
                authToken: String(req.headers.authorization)
            }
        );
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const handleConfigurationUpdate: RequestHandler = async (req, res, next) => {
    try {
        const result = await configurationFacade.update(
            {
                configurationId: req.params.configurationId,
                zeplin: req.body.zeplin
            },
            {
                authToken: String(req.headers.authorization)
            }
        );
        res.json(result);
    } catch (error) {
        next(error);
    }
};
