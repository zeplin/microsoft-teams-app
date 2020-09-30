import { projectSpacingTokenHandler } from "./projectSpacingTokenHandler";
import {
    ProjectPlatform,
    ProjectSpacingTokenCreateEvent,
    ProjectSpacingTokenUpdateEvent
} from "../../../../adapters/zeplin/types";

type GetDummyEventParams = {
    action?: string;
    spacingTokenId?: string;
    spacingTokenName?: string;
    projectPlatform?: ProjectPlatform;
}

function getDummyEvent({
    action = "created",
    spacingTokenId = "spacingTokenId",
    spacingTokenName = "spacingTokenName",
    projectPlatform = ProjectPlatform.WEB
}: GetDummyEventParams = {}): ProjectSpacingTokenCreateEvent | ProjectSpacingTokenUpdateEvent {
    return {
        payload: {
            action,
            context: {
                project: {
                    id: "projectId",
                    name: "projectName",
                    platform: projectPlatform
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
    } as ProjectSpacingTokenCreateEvent | ProjectSpacingTokenUpdateEvent;
}

describe("projectSpacingTokenHandler", () => {
    describe("getTeamsMessage method", () => {
        beforeAll(() => {
            jest.spyOn(Math, "random").mockReturnValue(0);
        });

        describe("for created notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    projectSpacingTokenHandler.getTeamsMessage([getDummyEvent()])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    projectSpacingTokenHandler.getTeamsMessage([
                        getDummyEvent(),
                        getDummyEvent({
                            spacingTokenId: "anotherSpacingTokenId",
                            spacingTokenName: "anotherSpacingTokenName"
                        })
                    ])
                ).toMatchSnapshot();
            });

            it.each([
                ProjectPlatform.ANDROID,
                ProjectPlatform.IOS,
                ProjectPlatform.MAC_OS,
                ProjectPlatform.WEB
            ])("should match snapshot when project platform is %s",
                projectPlatform => {
                    expect(
                        projectSpacingTokenHandler.getTeamsMessage([getDummyEvent({ projectPlatform })])
                    ).toMatchSnapshot();
                }
            );
        });

        describe("for updated notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    projectSpacingTokenHandler.getTeamsMessage([getDummyEvent({ action: "updated" })])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    projectSpacingTokenHandler.getTeamsMessage([
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

            it.each([
                ProjectPlatform.ANDROID,
                ProjectPlatform.IOS,
                ProjectPlatform.MAC_OS,
                ProjectPlatform.WEB
            ])("should match snapshot when project platform is %s",
                projectPlatform => {
                    expect(
                        projectSpacingTokenHandler.getTeamsMessage([
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
