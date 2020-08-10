import { WebhookEvent } from "../../../messagingTypes";
import {
    projectColorNotificationHandler,
    ProjectColorEventPayload
} from "./projectColorNotificationHandler";

type GetDummyEventParams = {
    action?: string;
    colorId?: string;
    colorName?: string;
}

function getDummyEvent({
    action = "created",
    colorId = "colorId",
    colorName = "colorName"
}: GetDummyEventParams = {}): WebhookEvent<ProjectColorEventPayload> {
    return {
        payload: {
            action,
            context: {
                project: {
                    id: "projectId",
                    name: "projectName"
                }
            },
            resource: {
                id: colorId,
                data: {
                    id: colorId,
                    name: colorName
                }
            }
        }
    } as WebhookEvent<ProjectColorEventPayload>;
}

describe("projectColorNotificationHandler", () => {
    describe("getTeamsMessage method", () => {
        describe("for created notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    projectColorNotificationHandler.getTeamsMessage([getDummyEvent()])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    projectColorNotificationHandler.getTeamsMessage([
                        getDummyEvent(),
                        getDummyEvent({
                            colorId: "anotherColorId",
                            colorName: "anotherColorName"
                        })
                    ])
                ).toMatchSnapshot();
            });
        });

        describe("for updated notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    projectColorNotificationHandler.getTeamsMessage([getDummyEvent({ action: "updated" })])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    projectColorNotificationHandler.getTeamsMessage([
                        getDummyEvent({
                            action: "updated"
                        }),
                        getDummyEvent({
                            action: "updated",
                            colorId: "anotherColorId",
                            colorName: "anotherColorName"
                        })
                    ])
                ).toMatchSnapshot();
            });
        });
    });
});
