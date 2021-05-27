import {
    Project,
    ProjectTextStyleCreatedEvent,
    ProjectTextStyleUpdatedEvent
} from "@zeplin/sdk";

import { projectTextStyleHandler } from "./projectTextStyleHandler";

type GetDummyEventParams = {
    action?: string;
    textStyleId?: string;
    textStyleName?: string;
    projectPlatform?: Project["platform"];
}

function getDummyEvent({
    action = "created",
    textStyleId = "textStyleId",
    textStyleName = "textStyleName",
    projectPlatform = "web"
}: GetDummyEventParams = {}): ProjectTextStyleCreatedEvent | ProjectTextStyleUpdatedEvent {
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
            id: textStyleId,
            data: {
                id: textStyleId,
                name: textStyleName
            }
        }
    } as ProjectTextStyleCreatedEvent | ProjectTextStyleUpdatedEvent;
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

            it.each<Project["platform"]>([
                "android",
                "ios",
                "macos",
                "web"
            ])("should match snapshot when project platform is %s",
                projectPlatform => {
                    expect(
                        projectTextStyleHandler.getTeamsMessage([getDummyEvent({ projectPlatform })])
                    ).toMatchSnapshot();
                }
            );
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

            it.each<Project["platform"]>([
                "android",
                "ios",
                "macos",
                "web"
            ])("should match snapshot when project platform is %s",
                projectPlatform => {
                    expect(
                        projectTextStyleHandler.getTeamsMessage([
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
