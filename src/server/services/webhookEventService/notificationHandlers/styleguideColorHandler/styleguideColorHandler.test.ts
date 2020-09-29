import { styleguideColorHandler } from "./styleguideColorHandler";
import {
    StyleguideColorCreateEvent,
    StyleguideColorUpdateEvent,
    StyleguidePlatform
} from "../../../../adapters/zeplin/types";

type GetDummyEventParams = {
    action?: string;
    colorId?: string;
    colorName?: string;
    styleguidePlatform?: string;
}

function getDummyEvent({
    action = "created",
    colorId = "colorId",
    colorName = "colorName",
    styleguidePlatform = StyleguidePlatform.WEB
}: GetDummyEventParams = {}): StyleguideColorCreateEvent | StyleguideColorUpdateEvent {
    return {
        payload: {
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
        }
    } as StyleguideColorCreateEvent | StyleguideColorUpdateEvent;
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

            it.each([
                StyleguidePlatform.ANDROID,
                StyleguidePlatform.IOS,
                StyleguidePlatform.MAC_OS,
                StyleguidePlatform.WEB,
                StyleguidePlatform.BASE
            ])("should match snapshot for every possible styleguide platform",
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

            it.each([
                StyleguidePlatform.ANDROID,
                StyleguidePlatform.IOS,
                StyleguidePlatform.MAC_OS,
                StyleguidePlatform.WEB,
                StyleguidePlatform.BASE
            ])("should match snapshot for every possible styleguide platform",
                styleguidePlatform => {
                    expect(
                        styleguideColorHandler.getTeamsMessage([getDummyEvent({ styleguidePlatform })])
                    ).toMatchSnapshot();
                }
            );
        });
    });
});
