import { RequestHandler } from "express";
import { PERMANENT_REDIRECT } from "http-status-codes";

export const handleMacAppRedirectLink: RequestHandler = (
    req,
    res
) => {
    res.redirect(PERMANENT_REDIRECT, req.query.uri as string);
};