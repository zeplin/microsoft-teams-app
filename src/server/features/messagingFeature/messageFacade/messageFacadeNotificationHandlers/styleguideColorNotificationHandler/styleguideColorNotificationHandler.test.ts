import { WebhookEvent } from "server/features/messagingFeature/messageTypes";
import { styleguideColorNotificationHandler, StyleguideColorEventPayload } from "./styleguideColorNotificationHandler";

const dummyEvent = {
    payload: {
        context: {
            styleguide: {
                id: "styleguideId"
            }
        },
        resource: {
            data: {
                name: "ColorName"
            }
        }
    }
} as WebhookEvent<StyleguideColorEventPayload>;
describe("styleguideColorNotificationHandler", () => {
    describe("getTeamsMessage method", () => {
        it("should return value start with Color named for 1 event", () => {
            const result = styleguideColorNotificationHandler.getTeamsMessage([dummyEvent]);
            expect(result.startsWith("Color named")).toBe(true);
        });
    });
});