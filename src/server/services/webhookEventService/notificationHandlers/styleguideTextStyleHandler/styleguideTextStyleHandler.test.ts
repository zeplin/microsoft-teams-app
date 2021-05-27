import {
    Styleguide,
    StyleguideTextStyleCreatedEvent,
    StyleguideTextStyleUpdatedEvent
} from "@zeplin/sdk";

import { styleguideTextStyleHandler } from "./styleguideTextStyleHandler";

type GetDummyEventParams = {
    action?: string;
    textStyleId?: string;
    textStyleName?: string;
    styleguidePlatform?: Styleguide["platform"];
}

function getDummyEvent({
    action = "created",
    textStyleId = "textStyleId",
    textStyleName = "textStyleName",
    styleguidePlatform = "web"
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

            it.each<Styleguide["platform"]>([
                "android",
                "ios",
                "macos",
                "web",
                "base"
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

            it.each<Styleguide["platform"]>([
                "android",
                "ios",
                "macos",
                "web",
                "base"
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
