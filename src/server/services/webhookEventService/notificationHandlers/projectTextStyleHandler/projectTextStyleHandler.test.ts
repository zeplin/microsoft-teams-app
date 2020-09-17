import { projectTextStyleHandler } from "./projectTextStyleHandler";
import {
    ProjectTextStyleCreateEvent,
    ProjectTextStyleUpdateEvent
} from "../../../../adapters/zeplin/types";

type GetDummyEventParams = {
    action?: string;
    textStyleId?: string;
    textStyleName?: string;
}

function getDummyEvent({
    action = "created",
    textStyleId = "textStyleId",
    textStyleName = "textStyleName"
}: GetDummyEventParams = {}): ProjectTextStyleCreateEvent | ProjectTextStyleUpdateEvent {
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
    } as ProjectTextStyleCreateEvent | ProjectTextStyleUpdateEvent;
}

describe("projectTextStyleHandler", () => {
    describe("getTeamsMessage method", () => {
        beforeAll(() => {
            jest.spyOn(Math, "random").mockReturnValue(0);
        });

        describe("for created notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    projectTextStyleHandler.getTeamsMessage([getDummyEvent()])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    projectTextStyleHandler.getTeamsMessage([
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
                    projectTextStyleHandler.getTeamsMessage([getDummyEvent({ action: "updated" })])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    projectTextStyleHandler.getTeamsMessage([
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
