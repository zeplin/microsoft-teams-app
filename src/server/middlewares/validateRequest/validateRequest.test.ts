import express, { ErrorRequestHandler, RequestHandler } from "express";
import request from "supertest";
import Joi from "@hapi/joi";
import { validateRequest } from "./validateRequest";
import { BAD_REQUEST, OK } from "http-status-codes";
import bodyParser from "body-parser";

const dummyMiddleware: RequestHandler = (req, res) => {
    res.json({});
};

const handleError: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) {
        next(err);
    } else {
        res.status(err.statusCode).json({
            message: err.message
        });
    }
};

function createServer({ url = "/", validationSchema }): request.SuperTest<request.Test> {
    const app = express();

    app.post(
        url,
        bodyParser.json(),
        validateRequest(validationSchema),
        dummyMiddleware,
        handleError
    );

    return request(app);
}

describe("validateRequest middleware", () => {
    describe("Validate params", () => {
        it("should pass when request have correct param", async () => {
            const requester = createServer({
                url: "/:myParam",
                validationSchema: {
                    params: Joi.object({
                        myParam: Joi.number()
                    })
                }
            });
            const response = await requester.post("/123");
            expect(response.status).toBe(OK);
        });

        it("should pass when request have multiple correct params", async () => {
            const requester = createServer({
                url: "/:myParam/:secondParam",
                validationSchema: {
                    params: Joi.object({
                        myParam: Joi.number(),
                        secondParam: Joi.number()
                    })
                }
            });
            const response = await requester.post("/123/213");
            expect(response.status).toBe(OK);
        });

        it("should pass when request have incorrect param", async () => {
            const requester = createServer({
                url: "/:myParam",
                validationSchema: {
                    params: Joi.object({
                        myParam: Joi.number()
                    })
                }
            });
            const response = await requester.post("/foo");
            expect(response.status).toBe(BAD_REQUEST);
            expect(response.body).toStrictEqual({ message: '"params.myParam" must be a number' });
        });
    });

    describe("Validate query", () => {
        it("should pass when request have correct query", async () => {
            const requester = createServer({
                validationSchema: {
                    query: Joi.object({
                        myQuery: Joi.number()
                    })
                }
            });
            const response = await requester.post("/?myQuery=123");
            expect(response.status).toBe(OK);
        });

        it("should pass when request have multiple correct queries", async () => {
            const requester = createServer({
                validationSchema: {
                    query: Joi.object({
                        myQuery: Joi.number(),
                        secondQuery: Joi.number()
                    })
                }
            });
            const response = await requester.post("/?myQuery=123&secondQuery=421");
            expect(response.status).toBe(OK);
        });

        it("should pass when request have incorrect query", async () => {
            const requester = createServer({
                validationSchema: {
                    query: Joi.object({
                        myQuery: Joi.number()
                    })
                }
            });
            const response = await requester.post("/?myQuery=foo");
            expect(response.status).toBe(BAD_REQUEST);
            expect(response.body).toStrictEqual({ message: '"query.myQuery" must be a number' });
        });
    });

    describe("Validate body", () => {
        it("should pass when request have correct body with single field", async () => {
            const requester = createServer({
                validationSchema: {
                    body: Joi.object({
                        myField: Joi.number()
                    })
                }
            });
            const response = await requester.post("/").send({ myField: 123 });
            expect(response.status).toBe(OK);
        });

        it("should pass when request have multiple correct body with multiple field", async () => {
            const requester = createServer({
                validationSchema: {
                    body: Joi.object({
                        myField: Joi.number(),
                        secondField: Joi.number()
                    })
                }
            });
            const response = await requester.post("/").send({ myField: 123, secondField: 231 });
            expect(response.status).toBe(OK);
        });

        it("should pass when request have incorrect body", async () => {
            const requester = createServer({
                validationSchema: {
                    body: Joi.object({
                        myField: Joi.number()
                    })
                }
            });
            const response = await requester.post("/").send({ myField: "asd" });
            expect(response.status).toBe(BAD_REQUEST);
            expect(response.body).toStrictEqual({ message: '"body.myField" must be a number' });
        });
    });
});
