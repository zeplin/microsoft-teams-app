import { BAD_REQUEST, OK } from "http-status-codes";
import nock, { Interceptor } from "nock";
import { ServerError } from "../../../errors";
import { Requester } from "../requester";
import { Projects } from "./Projects";
import { ProjectStatus } from "../types";

const authToken = "authToken";
const expectedResult: string[] = [];

describe("Zeplin > projects", () => {
    let projects: Projects;
    beforeAll(() => {
        projects = new Projects(new Requester({ baseURL: "http://localhost/v1" }));
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
            ).get("/v1/projects");
        });

        it("should return projects", async () => {
            mockInterceptor.reply(OK, expectedResult);

            const result = await projects.list({
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should return projects when limit filter is used", async () => {
            const limit = 20;

            mockInterceptor
                .query({ limit })
                .reply(OK, expectedResult);

            const result = await projects.list({
                query: {
                    limit
                },
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should return projects when offset filter is used", async () => {
            const offset = 20;

            mockInterceptor
                .query({ offset })
                .reply(OK, expectedResult);

            const result = await projects.list({
                query: {
                    offset
                },
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should return projects when status filter is used", async () => {
            const status = ProjectStatus.ACTIVE;

            mockInterceptor
                .query({ status })
                .reply(OK, expectedResult);

            const result = await projects.list({
                query: {
                    status
                },
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should return projects when workspace filter is used", async () => {
            const workspace = "personal";

            mockInterceptor
                .query({ workspace })
                .reply(OK, expectedResult);

            const result = await projects.list({
                query: {
                    workspace
                },
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should throw error when API throw error", async () => {
            mockInterceptor.reply(BAD_REQUEST, { message: "Bad request" });
            await expect(
                projects.list({
                    options: { authToken }
                })
            ).rejects.toEqual(new ServerError("Bad request", { statusCode: BAD_REQUEST }));
        });
    });

    describe("listMyProjects", () => {
        let mockInterceptor: Interceptor;
        beforeEach(() => {
            mockInterceptor = nock(
                "http://localhost",
                {
                    reqheaders: {
                        Authorization: authToken
                    }
                }
            ).get("/v1/users/me/projects");
        });

        it("should return projects", async () => {
            mockInterceptor.reply(OK, expectedResult);

            const result = await projects.listMyProjects({
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should return projects when limit filter is used", async () => {
            const limit = 20;

            mockInterceptor
                .query({ limit })
                .reply(OK, expectedResult);

            const result = await projects.listMyProjects({
                query: {
                    limit
                },
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should return projects when offset filter is used", async () => {
            const offset = 20;

            mockInterceptor
                .query({ offset })
                .reply(OK, expectedResult);

            const result = await projects.listMyProjects({
                query: {
                    offset
                },
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should return projects when status filter is used", async () => {
            const status = ProjectStatus.ACTIVE;

            mockInterceptor
                .query({ status })
                .reply(OK, expectedResult);

            const result = await projects.listMyProjects({
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
                projects.listMyProjects({
                    options: { authToken }
                })
            ).rejects.toEqual(new ServerError("Bad request", { statusCode: BAD_REQUEST }));
        });
    });
});
