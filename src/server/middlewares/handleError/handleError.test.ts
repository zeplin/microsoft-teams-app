import express from "express";
import request from "supertest";
import { handleError } from "./handleError";
import { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } from "http-status-codes";
import { ServiceError } from "../../errors";

describe("handleError", () => {
    it("should do nothing if response is sent", async () => {
        const app = express();

        app.get(
            "/",
            (req, res, next) => {
                res.json({});
                next(new Error("hello"));
            },
            handleError
        );

        const requester = request(app);

        const response = await requester.get("/");
        expect(response.status).toBe(OK);
    });

    it("should send error to client when there is an error", async () => {
        const app = express();

        app.get(
            "/",
            (req, res, next) => {
                next(new ServiceError("Case specific message", { statusCode: UNAUTHORIZED, title: "Title" }));
            },
            handleError
        );

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

        app.get(
            "/",
            (req, res, next) => {
                next(new ServiceError("Case specific message", { title: "Title" }));
            },
            handleError
        );

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

        app.get(
            "/",
            (req, res, next) => {
                next(new ServiceError("Case specific message", { statusCode: UNAUTHORIZED }));
            },
            handleError
        );

        const requester = request(app);

        const response = await requester.get("/");
        expect(response.status).toBe(UNAUTHORIZED);
        expect(response.body).toStrictEqual({
            detail: "Case specific message",
            title: "Unexpected Error"
        });
    });
});
