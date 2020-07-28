import express, { ErrorRequestHandler, RequestHandler } from "express";
import request from "supertest";
import { JSONBodyParser } from "./bodyParser";
import { BAD_REQUEST, OK } from "http-status-codes";

const dummyMiddleware: RequestHandler = (req, res) => {
    res.json(req.body);
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

function createServer(): request.SuperTest<request.Test> {
    const app = express();

    app.post(
        "/json",
        JSONBodyParser,
        dummyMiddleware,
        handleError
    );

    return request(app);
}

// Since the middleware needs a complex request object, It is hard to mock it like at other middleware test cases
// That's why a mock server is used instead
describe("BodyParser middleware", () => {
    let requester: request.SuperTest<request.Test>;
    beforeAll(() => {
        requester = createServer();
    });

    describe("JSONBodyParser", () => {
        it("should send error when content type is missing", async () => {
            const response = await requester.post("/json");
            expect(response.status).toBe(BAD_REQUEST);
            expect(response.body.message).toBe("Content type is required");
        });

        it("should return 400 when content type is yaml", async () => {
            const response = await requester.post("/json")
                .send('name: hook\nurl:"https://google.com"')
                .type("yaml");
            expect(response.status).toBe(BAD_REQUEST);
            expect(response.body.message).toBe(`Content type text/yaml is not supported`);
        });

        it("should return 400 when body is invalid json", async () => {
            const response = await requester.post("/json")
                .send("{\"invalid\"}")
                .type("json");
            expect(response.status).toBe(BAD_REQUEST);
            expect(response.body.message).toContain("Unexpected token");
        });

        it("should send body when body is valid json", async () => {
            const response = await requester.post("/json")
                .send({ hello: "world" })
                .type("json");
            expect(response.status).toBe(OK);
            expect(response.body).toStrictEqual({ hello: "world" });
        });
    });
});
