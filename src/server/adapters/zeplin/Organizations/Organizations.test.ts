import { BAD_REQUEST, OK } from "http-status-codes";
import nock, { Interceptor } from "nock";

import { ServerError } from "../../../errors";
import { Requester } from "../requester";
import { OrganizationRole } from "../types";
import { Organizations } from "./Organizations";

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

    describe("list", () => {
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
                    role: [OrganizationRole.ADMIN, OrganizationRole.OWNER]
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
            ).rejects.toEqual(new ServerError("Bad request", { statusCode: BAD_REQUEST }));
        });
    });
});
