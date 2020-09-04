import { projectTextStyleNotificationHandler } from "./projectTextStyleNotificationHandler";
import { ProjectTextStyleEvent } from "../../../../../adapters/zeplin/types";

type GetDummyEventParams = {
    action?: string;
    textStyleId?: string;
    textStyleName?: string;
}

function getDummyEvent({
    action = "created",
    textStyleId = "textStyleId",
    textStyleName = "textStyleName"
}: GetDummyEventParams = {}): ProjectTextStyleEvent {
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
                id: textStyleId,
                data: {
                    id: textStyleId,
                    name: textStyleName
                }
            }
        }
    } as ProjectTextStyleEvent;
}

describe("projectTextStyleNotificationHandler", () => {
    describe("getTeamsMessage method", () => {
        describe("for created notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    projectTextStyleNotificationHandler.getTeamsMessage([getDummyEvent()])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    projectTextStyleNotificationHandler.getTeamsMessage([
                        getDummyEvent(),
                        getDummyEvent({
                            textStyleId: "anotherTextStyleId",
                            textStyleName: "anotherTextStyleName"
                        })
                    ])
                ).toMatchSnapshot();
            });
        });

        describe("for updated notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    projectTextStyleNotificationHandler.getTeamsMessage([getDummyEvent({ action: "updated" })])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    projectTextStyleNotificationHandler.getTeamsMessage([
                        getDummyEvent({
                            action: "updated"
                        }),
                        getDummyEvent({
                            action: "updated",
                            textStyleId: "anotherTextStyleId",
                            textStyleName: "anotherTextStyleName"
                        })
                    ])
                ).toMatchSnapshot();
            });
        });
    });
});
