import { WebhookEvent } from "../../../messagingTypes";
import {
    projectSpacingTokenNotificationHandler,
    ProjectSpacingTokenEventPayload
} from "./projectSpacingTokenNotificationHandler";

type GetDummyEventParams = {
    action?: string;
    spacingTokenId?: string;
    spacingTokenName?: string;
}

function getDummyEvent({
    action = "created",
    spacingTokenId = "spacingTokenId",
    spacingTokenName = "spacingTokenName"
}: GetDummyEventParams = {}): WebhookEvent<ProjectSpacingTokenEventPayload> {
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
                id: spacingTokenId,
                data: {
                    id: spacingTokenId,
                    name: spacingTokenName
                }
            }
        }
    } as WebhookEvent<ProjectSpacingTokenEventPayload>;
}

describe("projectSpacingTokenNotificationHandler", () => {
    describe("getTeamsMessage method", () => {
        describe("for created notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    projectSpacingTokenNotificationHandler.getTeamsMessage([getDummyEvent()])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    projectSpacingTokenNotificationHandler.getTeamsMessage([
                        getDummyEvent(),
                        getDummyEvent({
                            spacingTokenId: "anotherSpacingTokenId",
                            spacingTokenName: "anotherSpacingTokenName"
                        })
                    ])
                ).toMatchSnapshot();
            });
        });

        describe("for updated notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    projectSpacingTokenNotificationHandler.getTeamsMessage([getDummyEvent({ action: "updated" })])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    projectSpacingTokenNotificationHandler.getTeamsMessage([
                        getDummyEvent({
                            action: "updated"
                        }),
                        getDummyEvent({
                            action: "updated",
                            spacingTokenId: "anotherSpacingTokenId",
                            spacingTokenName: "anotherSpacingTokenName"
                        })
                    ])
                ).toMatchSnapshot();
            });
        });
    });
});