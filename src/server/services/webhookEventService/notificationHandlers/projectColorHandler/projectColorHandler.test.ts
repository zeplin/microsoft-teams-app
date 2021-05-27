import {
    Project,
    ProjectColorCreatedEvent,
    ProjectColorUpdatedEvent
} from "@zeplin/sdk";

import { projectColorHandler } from "./projectColorHandler";

type GetDummyEventParams = {
    action?: string;
    colorId?: string;
    colorName?: string;
    projectPlatform?: Project["platform"];
}

function getDummyEvent({
    action = "created",
    colorId = "colorId",
    colorName = "colorName",
    projectPlatform = "web"
}: GetDummyEventParams = {}): ProjectColorCreatedEvent | ProjectColorUpdatedEvent {
    return {
        action,
        context: {
            project: {
                id: "projectId",
                name: "projectName",
                platform: projectPlatform
            }
        },
        resource: {
            id: colorId,
            data: {
                id: colorId,
                name: colorName
            }
        }
    } as ProjectColorCreatedEvent | ProjectColorUpdatedEvent;
}

describe("projectColorHandler", () => {
    describe("getTeamsMessage method", () => {
        beforeAll(() => {
            jest.spyOn(Math, "random").mockReturnValue(0);
        });

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

            it.each<Project["platform"]>([
                "android",
                "ios",
                "macos",
                "web"
            ])("should match snapshot when project platform is %s",
                projectPlatform => {
                    expect(
                        projectColorHandler.getTeamsMessage([getDummyEvent({ projectPlatform })])
                    ).toMatchSnapshot();
                }
            );
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

            it.each<Project["platform"]>([
                "android",
                "ios",
                "macos",
                "web"
            ])("should match snapshot when project platform is %s",
                projectPlatform => {
                    expect(
                        projectColorHandler.getTeamsMessage([
                            getDummyEvent({
                                action: "updated",
                                projectPlatform
                            })
                        ])
                    ).toMatchSnapshot();
                }
            );
        });
    });
});
