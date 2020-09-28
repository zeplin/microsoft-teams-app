import { StyleguideWebhooks } from "./StyleguideWebhooks";
import { StyleguideWebhookEventType } from "../../types";
import { BAD_REQUEST, OK } from "http-status-codes";
import nock, { Interceptor } from "nock";
import { ZeplinError } from "../../ZeplinError";
import { Requester } from "../../requester";

const authToken = "authToken";
const styleguideId = "styleguideId";
const webhookUrl = "https://webhook.url.com";
const webhookSecret = "secret";
const webhookEvents = [StyleguideWebhookEventType.ALL];

const createMockInterceptor = (): Interceptor => nock(
    "http://localhost",
    {
        reqheaders: {
            Authorization: authToken
        }
    }
).post(
    "/v1/styleguides/styleguideId/webhooks",
    {
        url: webhookUrl,
        events: webhookEvents,
        secret: webhookSecret
    }
);

describe("Zeplin > Webhooks > StyleguideWebhooks", () => {
    let styleguideWebhooks: StyleguideWebhooks;
    beforeAll(() => {
        styleguideWebhooks = new StyleguideWebhooks(new Requester({ baseURL: "http://localhost/v1" }));
    });

    describe("create", () => {
        it("should return id of the webhook", async () => {
            createMockInterceptor().reply(
                OK,
                { id: "webhookId" }
            );

            const webhookId = await styleguideWebhooks.create({
                params: { styleguideId },
                body: {
                    url: webhookUrl,
                    events: webhookEvents,
                    secret: webhookSecret
                },
                options: { authToken }
            });

            expect(webhookId).toStrictEqual("webhookId");
        });

        it("should throw error when API throw error", async () => {
            createMockInterceptor().reply(
                BAD_REQUEST,
                { message: "Bad request" }
            );
            await expect(
                styleguideWebhooks.create({
                    params: { styleguideId },
                    body: {
                        url: webhookUrl,
                        events: webhookEvents,
                        secret: webhookSecret
                    },
                    options: { authToken }
                })
            ).rejects.toEqual(new ZeplinError("Bad request", { statusCode: BAD_REQUEST }));
        });
    });
});
