import { OrganizationRole, Organizations } from "./Organizations";
import { BAD_REQUEST, OK } from "http-status-codes";
import nock, { Interceptor } from "nock";
import { ZeplinError } from "../ZeplinError";
import { Requester } from "../requester";

const authToken = "authToken";

const createMockInterceptor = (): Interceptor => nock(
    "http://localhost",
    {
        reqheaders: {
            Authorization: authToken
        }
    }
).get("/v1/organizations");

describe("Zeplin > organizations", () => {
    let organizations: Organizations;
    beforeAll(() => {
        organizations = new Organizations(new Requester({ baseURL: "http://localhost/v1" }));
    });

    describe("findAll", () => {
        it("should return organizations", async () => {
            const expectedResult = [
                {
                    id: "organizationId",
                    name: "organizationName",
                    logo: "http://placekitten.com/300/300"
                },

                {
                    id: "otherOrganizationId",
                    name: "otherOrganizationName"
                }
            ];
            createMockInterceptor().reply(OK, expectedResult);

            const result = await organizations.list({
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });
        it("should return organizations when multiple role filter is used", async () => {
            const expectedResult = [
                {
                    id: "organizationId",
                    name: "organizationName",
                    logo: "http://placekitten.com/300/300"
                },

                {
                    id: "otherOrganizationId",
                    name: "otherOrganizationName"
                }
            ];
            createMockInterceptor()
                .query({ "role[]": ["admin", "owner"] })
                .reply(OK, expectedResult);

            const result = await organizations.list({
                query: {
                    roles: [OrganizationRole.ADMIN, OrganizationRole.OWNER]
                },
                options: { authToken }
            });

            expect(result).toStrictEqual(expectedResult);
        });

        it("should throw error when API throw error", async () => {
            createMockInterceptor().reply(BAD_REQUEST, { message: "Bad request" });
            await expect(
                organizations.list({
                    options: { authToken }
                })
            ).rejects.toEqual(new ZeplinError("Bad request", { statusCode: BAD_REQUEST }));
        });
    });
});
