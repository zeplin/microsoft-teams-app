import { WebhookEvent } from "../../../messagingTypes";
import {
    projectColorNotificationHandler,
    ProjectColorEventPayload
} from "./projectColorNotificationHandler";

const dummyEvent = {
    payload: {
        action: "created",
        context: {
            project: {
                id: "projectId"
            }
        },
        resource: {
            id: "colorId",
            data: {
                id: "colorId",
                name: "ColorName"
            }
        }
    }
} as WebhookEvent<ProjectColorEventPayload>;
describe("projectColorNotificationHandler", () => {
    describe("getTeamsMessage method", () => {
        describe("for created notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    projectColorNotificationHandler.getTeamsMessage([dummyEvent])
                ).toMatchSnapshot();
            });
        });
    });
});
