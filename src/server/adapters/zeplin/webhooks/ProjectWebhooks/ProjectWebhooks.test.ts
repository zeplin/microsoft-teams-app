import { ProjectWebhooks } from "./ProjectWebhooks";
import { ProjectWebhookEventType } from "../../types";
import { BAD_REQUEST, OK } from "http-status-codes";
import nock, { Interceptor } from "nock";
import { ServerError } from "../../../../errors";
import { Requester } from "../../requester";

const authToken = "authToken";
const projectId = "projectId";
const webhookUrl = "https://webhook.url.com";
const webhookSecret = "secret";
const webhookEvents = [ProjectWebhookEventType.ALL];

const createMockInterceptor = (): Interceptor => nock(
    "http://localhost",
    {
        reqheaders: {
            Authorization: authToken
        }
    }
).post(
    "/v1/projects/projectId/webhooks",
    {
        url: webhookUrl,
        events: webhookEvents,
        secret: webhookSecret
    }
);

describe("Zeplin > Webhooks > ProjectWebhooks", () => {
    let projectWebhooks: ProjectWebhooks;
    beforeAll(() => {
        projectWebhooks = new ProjectWebhooks(new Requester({ baseURL: "http://localhost/v1" }));
    });

    describe("create", () => {
        it("should return id of the webhook", async () => {
            createMockInterceptor().reply(
                OK,
                { id: "webhookId" }
            );

            const webhookId = await projectWebhooks.create({
                params: { projectId },
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
                projectWebhooks.create({
                    params: { projectId },
                    body: {
                        url: webhookUrl,
                        events: webhookEvents,
                        secret: webhookSecret
                    },
                    options: { authToken }
                })
            ).rejects.toEqual(new ServerError("Bad request", { statusCode: BAD_REQUEST }));
        });
    });
});
