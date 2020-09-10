import express, { RequestHandler } from "express";
import request from "supertest";
import { handleError } from "./handleError";
import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from "http-status-codes";
import { ServerError } from "../../errors";

describe("handleError", () => {
    it("should do nothing if response is sent", async () => {
        const app = express();

        const handler: RequestHandler = (req, res, next) => {
            res.json({});
            next(new Error("hello"));
        };

        app.get("/", handler, handleError);

        const requester = request(app);

        const response = await requester.get("/");
        expect(response.status).toBe(OK);
    });

    it("should send error to client when there is an error", async () => {
        const app = express();

        const handler: RequestHandler = (req, res, next) => {
            next(new ServerError("Case specific message", { statusCode: UNAUTHORIZED, title: "Title" }));
        };

        app.get("/", handler, handleError);

        const requester = request(app);

        const response = await requester.get("/");
        expect(response.status).toBe(UNAUTHORIZED);
        expect(response.body).toStrictEqual({
            detail: "Case specific message",
            title: "Title"
        });
    });

    it("should send internal server error when the status code is not specified", async () => {
        const app = express();

        const handler: RequestHandler = (req, res, next) => {
            next(new ServerError("Case specific message", { title: "Title" }));
        };

        app.get("/", handler, handleError);

        const requester = request(app);

        const response = await requester.get("/");
        expect(response.status).toBe(INTERNAL_SERVER_ERROR);
        expect(response.body).toStrictEqual({
            detail: "Case specific message",
            title: "Title"
        });
    });

    it('should send error with "Unexpected Error" title when the title is not specified', async () => {
        const app = express();

        const handler: RequestHandler = (req, res, next) => {
            next(new ServerError("Case specific message", { statusCode: UNAUTHORIZED }));
        };

        app.get("/", handler, handleError);

        const requester = request(app);

        const response = await requester.get("/");
        expect(response.status).toBe(UNAUTHORIZED);
        expect(response.body).toStrictEqual({
            detail: "Case specific message",
            title: "Unexpected Error"
        });
    });
});
