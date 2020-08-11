import { Requester } from "../requester";
import { Auth } from "./Auth";
import { BAD_REQUEST, OK } from "http-status-codes";
import { ZeplinError } from "../ZeplinError";
import nock, { Interceptor } from "nock";

const accessToken = "accessToken";
const refreshToken = "refreshToken";

const createMockInterceptor = (): Interceptor => nock("http://localhost").post(
    "/v1/oauth/token",
    {
        grant_type: "authorization_code",
        code: "code",
        client_id: "clientId",
        client_secret: "clientSecret",
        redirect_uri: "redirectUri"
    }
);

describe("Zeplin > auth", () => {
    let auth: Auth;
    beforeAll(() => {
        auth = new Auth(new Requester({ baseURL: "http://localhost/v1" }));
    });

    describe("getAuthorizeUrl", () => {
        it("should return authorize url", () => {
            const url = auth.getAuthorizationUrl({
                query: {
                    clientId: "clientId",
                    redirectUri: "http://redirect.url.com"
                }
            });

            expect(url).toBe("http://localhost/v1/oauth/authorize?redirect_uri=http:%2F%2Fredirect.url.com&client_id=clientId&response_type=code");
        });
    });

    describe("createToken", () => {
        it("should return token", async () => {
            createMockInterceptor().reply(
                OK,
                { access_token: accessToken, refresh_token: refreshToken }
            );

            const token = await auth.createToken({
                body: {
                    code: "code",
                    clientId: "clientId",
                    clientSecret: "clientSecret",
                    redirectUri: "redirectUri"
                }
            });

            expect(token).toStrictEqual({ accessToken, refreshToken });
        });

        it("should throw error when API throw error", async () => {
            createMockInterceptor().reply(
                BAD_REQUEST,
                { message: "Bad request" }
            );
            await expect(
                auth.createToken({
                    body: {
                        code: "code",
                        clientId: "clientId",
                        clientSecret: "clientSecret",
                        redirectUri: "redirectUri"
                    }
                })
            ).rejects.toEqual(new ZeplinError("Bad request", { statusCode: BAD_REQUEST }));
        });
    });
});
