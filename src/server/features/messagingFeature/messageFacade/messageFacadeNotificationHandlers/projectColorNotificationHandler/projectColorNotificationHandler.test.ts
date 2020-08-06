import { WebhookEvent } from "../../../messagingTypes";
import { projectColorNotificationHandler, ProjectColorEventPayload } from "./projectColorNotificationHandler";

const dummyEvent = {
    payload: {
        context: {
            project: {
                id: "projectId"
            }
        },
        resource: {
            data: {
                name: "ColorName"
            }
        }
    }
} as WebhookEvent<ProjectColorEventPayload>;
describe("projectColorNotificationHandler", () => {
    describe("getTeamsMessage method", () => {
        it("should return value start with Color named for 1 event", () => {
            const result = projectColorNotificationHandler.getTeamsMessage([dummyEvent]);
            expect(result.startsWith("Color named")).toBe(true);
        });
    });
});