import axios from "axios";
import { ProjectWebhook } from "./ProjectWebhook";
import { ProjectWebhookEvents } from "../../../enums";
import { BAD_REQUEST, OK } from "http-status-codes";
import nock, { Interceptor } from "nock";
import { ZeplinError } from "../ZeplinError";

const token = "authToken";
const projectId = "projectId";
const webhookUrl = "https://webhook.url.com";
const webhookSecret = "secret";
const webhookEvents = [ProjectWebhookEvents.PROJECT_ALL];

const createMockInterceptor = (): Interceptor => nock(
    "http://localhost",
    {
        reqheaders: {
            Authorization: token
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

describe("Zeplin > projectWebhook", () => {
    let projectWebhook: ProjectWebhook;
    beforeAll(() => {
        projectWebhook = new ProjectWebhook(axios.create({ baseURL: "http://localhost/v1" }), webhookSecret);
    });

    describe("create", () => {
        it("should return id of the webhook", async () => {
            createMockInterceptor().reply(
                OK,
                { id: "webhookId" }
            );

            const webhookId = await projectWebhook.create(
                projectId,
                token,
                {
                    url: webhookUrl,
                    events: webhookEvents
                }
            );

            expect(webhookId).toStrictEqual("webhookId");
        });

        it("should throw error when API throw error", async () => {
            createMockInterceptor().reply(
                BAD_REQUEST,
                { message: "Bad request" }
            );
            await expect(projectWebhook.create(
                projectId,
                token,
                {
                    url: webhookUrl,
                    events: webhookEvents
                }
            )).rejects.toEqual(new ZeplinError("Bad request", { statusCode: BAD_REQUEST }));
        });
    });
});
