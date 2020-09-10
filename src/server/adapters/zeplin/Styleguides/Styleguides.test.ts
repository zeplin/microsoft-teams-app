import { BAD_REQUEST, OK } from "http-status-codes";
import nock, { Interceptor } from "nock";
import { ZeplinError } from "../ZeplinError";
import { Requester } from "../requester";
import { Styleguides } from "./Styleguides";
import { StyleguideStatus } from "../types";

const authToken = "authToken";
const expectedResult: string[] = [];

describe("Zeplin > styleguides", () => {
    let styleguides: Styleguides;
    beforeAll(() => {
        styleguides = new Styleguides(new Requester({ baseURL: "http://localhost/v1" }));
    });

    describe("list", () => {
        let mockInterceptor: Interceptor;
        beforeEach(() => {
            mockInterceptor = nock(
                "http://localhost",
                {
                    reqheaders: {
                        Authorization: authToken
                    }
                }
            ).get("/v1/styleguides");
        });

        it("should return styleguides", async () => {
            mockInterceptor.reply(OK, expectedResult);

            const result = await styleguides.list({
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should return styleguides when limit filter is used", async () => {
            const limit = 20;

            mockInterceptor
                .query({ limit })
                .reply(OK, expectedResult);

            const result = await styleguides.list({
                query: {
                    limit
                },
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should return styleguides when offset filter is used", async () => {
            const offset = 20;

            mockInterceptor
                .query({ offset })
                .reply(OK, expectedResult);

            const result = await styleguides.list({
                query: {
                    offset
                },
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should return styleguides when status filter is used", async () => {
            const status = StyleguideStatus.ACTIVE;

            mockInterceptor
                .query({ status })
                .reply(OK, expectedResult);

            const result = await styleguides.list({
                query: {
                    status
                },
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should return styleguides when workspace filter is used", async () => {
            const workspace = "personal";

            mockInterceptor
                .query({ workspace })
                .reply(OK, expectedResult);

            const result = await styleguides.list({
                query: {
                    workspace
                },
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should return styleguides when linked_project filter is used", async () => {
            const linked_project = "projectId";

            mockInterceptor
                .query({ linked_project })
                .reply(OK, expectedResult);

            const result = await styleguides.list({
                query: {
                    linked_project
                },
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should throw error when API throw error", async () => {
            mockInterceptor.reply(BAD_REQUEST, { message: "Bad request" });
            await expect(
                styleguides.list({
                    options: { authToken }
                })
            ).rejects.toEqual(new ZeplinError("Bad request", { statusCode: BAD_REQUEST }));
        });
    });

    describe("list", () => {
        let mockInterceptor: Interceptor;
        beforeEach(() => {
            mockInterceptor = nock(
                "http://localhost",
                {
                    reqheaders: {
                        Authorization: authToken
                    }
                }
            ).get("/v1/users/me/styleguides");
        });

        it("should return styleguides", async () => {
            mockInterceptor.reply(OK, expectedResult);

            const result = await styleguides.listMyStyleguides({
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should return styleguides when limit filter is used", async () => {
            const limit = 20;

            mockInterceptor
                .query({ limit })
                .reply(OK, expectedResult);

            const result = await styleguides.listMyStyleguides({
                query: {
                    limit
                },
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should return styleguides when offset filter is used", async () => {
            const offset = 20;

            mockInterceptor
                .query({ offset })
                .reply(OK, expectedResult);

            const result = await styleguides.listMyStyleguides({
                query: {
                    offset
                },
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should return styleguides when status filter is used", async () => {
            const status = StyleguideStatus.ACTIVE;

            mockInterceptor
                .query({ status })
                .reply(OK, expectedResult);

            const result = await styleguides.listMyStyleguides({
                query: {
                    status
                },
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should throw error when API throw error", async () => {
            mockInterceptor.reply(BAD_REQUEST, { message: "Bad request" });
            await expect(
                styleguides.listMyStyleguides({ options: { authToken } })
            ).rejects.toEqual(new ZeplinError("Bad request", { statusCode: BAD_REQUEST }));
        });
    });
});
