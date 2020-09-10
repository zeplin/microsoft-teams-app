import { styleguideSpacingTokenHandler } from "./styleguideSpacingTokenHandler";
import {
    StyleguideSpacingTokenCreateEvent,
    StyleguideSpacingTokenUpdateEvent
} from "../../../../adapters/zeplin/types";

type GetDummyEventParams = {
    action?: string;
    spacingTokenId?: string;
    spacingTokenName?: string;
}

function getDummyEvent({
    action = "created",
    spacingTokenId = "spacingTokenId",
    spacingTokenName = "spacingTokenName"
}: GetDummyEventParams = {}): StyleguideSpacingTokenCreateEvent | StyleguideSpacingTokenUpdateEvent {
    return {
        payload: {
            action,
            context: {
                styleguide: {
                    id: "styleguideId",
                    name: "styleguideName"
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
    } as StyleguideSpacingTokenCreateEvent | StyleguideSpacingTokenUpdateEvent;
}

describe("styleguideSpacingTokenHandler", () => {
    describe("getTeamsMessage method", () => {
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
        });
    });
});
