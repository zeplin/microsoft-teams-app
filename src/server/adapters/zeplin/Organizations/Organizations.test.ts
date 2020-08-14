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
            const organizationsResponse = [
                {
                    id: "organizationId",
                    name: "organizationName",
                    url: "http://placekitten.com/300/300"
                },

                {
                    id: "otherOrganizationId",
                    name: "otherOrganizationName"
                }
            ];
            createMockInterceptor().reply(OK, organizationsResponse);

            const webhookId = await organizations.findAll({
                options: { authToken }
            });

            expect(webhookId).toStrictEqual(organizationsResponse);
        });
        it("should return organizations when multiple role filter is used", async () => {
            const organizationsResponse = [
                {
                    id: "organizationId",
                    name: "organizationName",
                    url: "http://placekitten.com/300/300"
                },

                {
                    id: "otherOrganizationId",
                    name: "otherOrganizationName"
                }
            ];
            createMockInterceptor()
                .query({ "role[]": ["admin", "owner"] })
                .reply(OK, organizationsResponse);

            const webhookId = await organizations.findAll({
                query: {
                    roles: [OrganizationRole.ADMIN, OrganizationRole.OWNER]
                },
                options: { authToken }
            });

            expect(webhookId).toStrictEqual(organizationsResponse);
        });

        it("should throw error when API throw error", async () => {
            createMockInterceptor().reply(BAD_REQUEST, { message: "Bad request" });
            await expect(
                organizations.findAll({
                    options: { authToken }
                })
            ).rejects.toEqual(new ZeplinError("Bad request", { statusCode: BAD_REQUEST }));
        });
    });
});
