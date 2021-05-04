import { StyleguideSpacingTokenCreatedEvent, StyleguideSpacingTokenUpdatedEvent } from "@zeplin/sdk";

import { StyleguidePlatformEnum } from "../../../../enums";

import { styleguideSpacingTokenHandler } from "./styleguideSpacingTokenHandler";

type GetDummyEventParams = {
    action?: string;
    spacingTokenId?: string;
    spacingTokenName?: string;
    styleguidePlatform?: string;
}

function getDummyEvent({
    action = "created",
    spacingTokenId = "spacingTokenId",
    spacingTokenName = "spacingTokenName",
    styleguidePlatform = StyleguidePlatformEnum.WEB
}: GetDummyEventParams = {}): StyleguideSpacingTokenCreatedEvent | StyleguideSpacingTokenUpdatedEvent {
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
            id: spacingTokenId,
            data: {
                id: spacingTokenId,
                name: spacingTokenName
            }
        }
    } as StyleguideSpacingTokenCreatedEvent | StyleguideSpacingTokenUpdatedEvent;
}

describe("styleguideSpacingTokenHandler", () => {
    describe("getTeamsMessage method", () => {
        beforeAll(() => {
            jest.spyOn(Math, "random").mockReturnValue(0);
        });

        describe("for created notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    styleguideSpacingTokenHandler.getTeamsMessage([getDummyEvent()])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    styleguideSpacingTokenHandler.getTeamsMessage([
                        getDummyEvent(),
                        getDummyEvent({
                            spacingTokenId: "anotherSpacingTokenId",
                            spacingTokenName: "anotherSpacingTokenName"
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
                        styleguideSpacingTokenHandler.getTeamsMessage([getDummyEvent({ styleguidePlatform })])
                    ).toMatchSnapshot();
                }
            );
        });

        describe("for updated notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    styleguideSpacingTokenHandler.getTeamsMessage([getDummyEvent({ action: "updated" })])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    styleguideSpacingTokenHandler.getTeamsMessage([
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
                StyleguidePlatformEnum.ANDROID,
                StyleguidePlatformEnum.IOS,
                StyleguidePlatformEnum.MAC_OS,
                StyleguidePlatformEnum.WEB,
                StyleguidePlatformEnum.BASE
            ])("should match snapshot when styleguide platform is %s",
                styleguidePlatform => {
                    expect(
                        styleguideSpacingTokenHandler.getTeamsMessage([getDummyEvent({ styleguidePlatform })])
                    ).toMatchSnapshot();
                }
            );
        });
    });
});
