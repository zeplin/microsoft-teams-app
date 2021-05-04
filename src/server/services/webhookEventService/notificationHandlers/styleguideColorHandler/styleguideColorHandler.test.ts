import { Styleguide, StyleguideColorCreatedEvent, StyleguideColorUpdatedEvent } from "@zeplin/sdk";

import { styleguideColorHandler } from "./styleguideColorHandler";

type GetDummyEventParams = {
    action?: string;
    colorId?: string;
    colorName?: string;
    styleguidePlatform?: Styleguide["platform"];
}

function getDummyEvent({
    action = "created",
    colorId = "colorId",
    colorName = "colorName",
    styleguidePlatform = "web"
}: GetDummyEventParams = {}): StyleguideColorCreatedEvent | StyleguideColorUpdatedEvent {
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
            id: colorId,
            data: {
                id: colorId,
                name: colorName
            }
        }
    } as StyleguideColorCreatedEvent | StyleguideColorUpdatedEvent;
}

describe("styleguideColorHandler", () => {
    describe("getTeamsMessage method", () => {
        beforeAll(() => {
            jest.spyOn(Math, "random").mockReturnValue(0);
        });

        describe("for created notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    styleguideColorHandler.getTeamsMessage([getDummyEvent()])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    styleguideColorHandler.getTeamsMessage([
                        getDummyEvent(),
                        getDummyEvent({
                            colorId: "anotherColorId",
                            colorName: "anotherColorName"
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
                        styleguideColorHandler.getTeamsMessage([getDummyEvent({ styleguidePlatform })])
                    ).toMatchSnapshot();
                }
            );
        });

        describe("for updated notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    styleguideColorHandler.getTeamsMessage([getDummyEvent({ action: "updated" })])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    styleguideColorHandler.getTeamsMessage([
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

            it.each<Styleguide["platform"]>([
                "android",
                "ios",
                "macos",
                "web",
                "base"
            ])("should match snapshot when styleguide platform is %s",
                styleguidePlatform => {
                    expect(
                        styleguideColorHandler.getTeamsMessage([getDummyEvent({ styleguidePlatform })])
                    ).toMatchSnapshot();
                }
            );
        });
    });
});
