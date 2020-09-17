import { styleguideColorHandler } from "./styleguideColorHandler";
import {
    StyleguideColorCreateEvent,
    StyleguideColorUpdateEvent
} from "../../../../adapters/zeplin/types";

type GetDummyEventParams = {
    action?: string;
    colorId?: string;
    colorName?: string;
}

function getDummyEvent({
    action = "created",
    colorId = "colorId",
    colorName = "colorName"
}: GetDummyEventParams = {}): StyleguideColorCreateEvent | StyleguideColorUpdateEvent {
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
        });
    });
});
