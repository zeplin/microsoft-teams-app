import { projectColorHandler } from "./projectColorHandler";
import {
    ProjectColorCreateEvent,
    ProjectColorUpdateEvent
} from "../../../../adapters/zeplin/types";

type GetDummyEventParams = {
    action?: string;
    colorId?: string;
    colorName?: string;
}

function getDummyEvent({
    action = "created",
    colorId = "colorId",
    colorName = "colorName"
}: GetDummyEventParams = {}): ProjectColorCreateEvent | ProjectColorUpdateEvent {
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
    } as ProjectColorCreateEvent | ProjectColorUpdateEvent;
}

describe("projectColorHandler", () => {
    describe("getTeamsMessage method", () => {
        describe("for created notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    projectColorHandler.getTeamsMessage([getDummyEvent()])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    projectColorHandler.getTeamsMessage([
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
                    projectColorHandler.getTeamsMessage([getDummyEvent({ action: "updated" })])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    projectColorHandler.getTeamsMessage([
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