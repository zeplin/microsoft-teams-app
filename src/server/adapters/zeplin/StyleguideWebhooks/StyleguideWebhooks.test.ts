import { StyleguideWebhooks } from "./StyleguideWebhooks";
import { StyleguideWebhookEvent } from "../../../enums";
import { BAD_REQUEST, OK } from "http-status-codes";
import nock, { Interceptor } from "nock";
import { ZeplinError } from "../ZeplinError";
import { Requester } from "../requester";

const authToken = "authToken";
const styleguideId = "styleguideId";
const webhookUrl = "https://webhook.url.com";
const webhookSecret = "secret";
const webhookEvents = [StyleguideWebhookEvent.ALL];

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

describe("Zeplin > projectWebhook", () => {
    let styleguideWebhooks: StyleguideWebhooks;
    beforeAll(() => {
        styleguideWebhooks = new StyleguideWebhooks(new Requester({ baseURL: "http://localhost/v1" }), webhookSecret);
    });

    describe("create", () => {
        it("should return id of the webhook", async () => {
            createMockInterceptor().reply(
                OK,
                { id: "webhookId" }
            );

            const webhookId = await styleguideWebhooks.create(
                { styleguideId },
                {
                    url: webhookUrl,
                    events: webhookEvents
                },
                { authToken }
            );

            expect(webhookId).toStrictEqual("webhookId");
        });

        it("should throw error when API throw error", async () => {
            createMockInterceptor().reply(
                BAD_REQUEST,
                { message: "Bad request" }
            );
            await expect(styleguideWebhooks.create(
                { styleguideId },
                {
                    url: webhookUrl,
                    events: webhookEvents
                },
                { authToken }
            )).rejects.toEqual(new ZeplinError("Bad request", { statusCode: BAD_REQUEST }));
        });
    });
});
