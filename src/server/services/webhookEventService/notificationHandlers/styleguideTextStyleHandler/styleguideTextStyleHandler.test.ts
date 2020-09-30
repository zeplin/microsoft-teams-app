import { styleguideTextStyleHandler } from "./styleguideTextStyleHandler";
import {
    StyleguidePlatform,
    StyleguideTextStyleCreateEvent,
    StyleguideTextStyleUpdateEvent
} from "../../../../adapters/zeplin/types";

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
    styleguidePlatform = StyleguidePlatform.WEB
}: GetDummyEventParams = {}): StyleguideTextStyleCreateEvent | StyleguideTextStyleUpdateEvent {
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
                id: textStyleId,
                data: {
                    id: textStyleId,
                    name: textStyleName
                }
            }
        }
    } as StyleguideTextStyleCreateEvent | StyleguideTextStyleUpdateEvent;
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
                StyleguidePlatform.ANDROID,
                StyleguidePlatform.IOS,
                StyleguidePlatform.MAC_OS,
                StyleguidePlatform.WEB,
                StyleguidePlatform.BASE
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
                StyleguidePlatform.ANDROID,
                StyleguidePlatform.IOS,
                StyleguidePlatform.MAC_OS,
                StyleguidePlatform.WEB,
                StyleguidePlatform.BASE
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
