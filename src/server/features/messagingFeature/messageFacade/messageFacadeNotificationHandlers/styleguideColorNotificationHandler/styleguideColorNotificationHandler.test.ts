import { WebhookEvent } from "../../../messagingTypes";
import {
    styleguideColorNotificationHandler,
    StyleguideColorEventPayload
} from "./styleguideColorNotificationHandler";

function getDummyEvent({
    action = "created",
    styleguideId = "styleguideId",
    styleguideName = "styleguideName",
    colorId = "colorId",
    colorName = "colorName"
}: {
    action?: string;
    styleguideId?: string;
    styleguideName?: string;
    colorId?: string;
    colorName?: string;
} = {}): WebhookEvent<StyleguideColorEventPayload> {
    return {
        payload: {
            action,
            context: {
                styleguide: {
                    id: styleguideId,
                    name: styleguideName
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
    } as WebhookEvent<StyleguideColorEventPayload>;
}

describe("styleguideColorNotificationHandler", () => {
    describe("getTeamsMessage method", () => {
        describe("for created notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    styleguideColorNotificationHandler.getTeamsMessage([getDummyEvent()])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    styleguideColorNotificationHandler.getTeamsMessage([
                        getDummyEvent(),
                        getDummyEvent({
                            styleguideId: "anotherStyleguideId",
                            styleguideName: "anotherStyleguideName",
                            colorId: "anotherColorId",
                            colorName: "anotherColorName"
                        })
                    ])
                ).toMatchSnapshot();
            });
        });

        describe("for updated notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    styleguideColorNotificationHandler.getTeamsMessage([getDummyEvent({ action: "updated" })])
                ).toMatchSnapshot();
            });

            it("should match snapshot when there are more than 1 events", () => {
                expect(
                    styleguideColorNotificationHandler.getTeamsMessage([
                        getDummyEvent({
                            action: "updated"
                        }),
                        getDummyEvent({
                            action: "updated",
                            styleguideId: "anotherStyleguideId",
                            styleguideName: "anotherStyleguideName",
                            colorId: "anotherColorId",
                            colorName: "anotherColorName"
                        })
                    ])
                ).toMatchSnapshot();
            });
        });
    });
});
