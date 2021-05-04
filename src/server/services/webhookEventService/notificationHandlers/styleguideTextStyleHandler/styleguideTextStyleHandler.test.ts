import {
    StyleguideTextStyleCreatedEvent,
    StyleguideTextStyleUpdatedEvent
} from "@zeplin/sdk";

import { StyleguidePlatformEnum } from "../../../../enums";

import { styleguideTextStyleHandler } from "./styleguideTextStyleHandler";

type GetDummyEventParams = {
    action?: string;
    textStyleId?: string;
    textStyleName?: string;
    styleguidePlatform?: string;
}

function getDummyEvent({
    action = "created",
    textStyleId = "textStyleId",
    textStyleName = "textStyleName",
    styleguidePlatform = StyleguidePlatformEnum.WEB
}: GetDummyEventParams = {}): StyleguideTextStyleCreatedEvent | StyleguideTextStyleUpdatedEvent {
    return {
        action,
        context: {
            styleguide: {
                id: "styleguideId",
                name: "styleguideName",
                platform: styleguidePlatform
            }
        },
        resource: {
            id: textStyleId,
            data: {
                id: textStyleId,
                name: textStyleName
            }
        }
    } as StyleguideTextStyleCreatedEvent | StyleguideTextStyleUpdatedEvent;
}

describe("styleguideTextStyleHandler", () => {
    describe("getTeamsMessage method", () => {
        beforeAll(() => {
            jest.spyOn(Math, "random").mockReturnValue(0);
        });

        describe("for created notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    styleguideTextStyleHandler.getTeamsMessage([getDummyEvent()])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    styleguideTextStyleHandler.getTeamsMessage([
                        getDummyEvent(),
                        getDummyEvent({
                            textStyleId: "anotherTextStyleId",
                            textStyleName: "anotherTextStyleName"
                        })
                    ])
                ).toMatchSnapshot();
            });

            it.each([
                StyleguidePlatformEnum.ANDROID,
                StyleguidePlatformEnum.IOS,
                StyleguidePlatformEnum.MAC_OS,
                StyleguidePlatformEnum.WEB,
                StyleguidePlatformEnum.BASE
            ])("should match snapshot when styleguide platform is %s",
                styleguidePlatform => {
                    expect(
                        styleguideTextStyleHandler.getTeamsMessage([getDummyEvent({ styleguidePlatform })])
                    ).toMatchSnapshot();
                }
            );
        });

        describe("for updated notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    styleguideTextStyleHandler.getTeamsMessage([getDummyEvent({ action: "updated" })])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    styleguideTextStyleHandler.getTeamsMessage([
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

            it.each([
                StyleguidePlatformEnum.ANDROID,
                StyleguidePlatformEnum.IOS,
                StyleguidePlatformEnum.MAC_OS,
                StyleguidePlatformEnum.WEB,
                StyleguidePlatformEnum.BASE
            ])("should match snapshot when styleguide platform is %s",
                styleguidePlatform => {
                    expect(
                        styleguideTextStyleHandler.getTeamsMessage([getDummyEvent({ styleguidePlatform })])
                    ).toMatchSnapshot();
                }
            );
        });
    });
});
