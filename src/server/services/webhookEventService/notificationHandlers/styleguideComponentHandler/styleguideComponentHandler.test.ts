import { StyleguideComponentCreatedEvent, StyleguideComponentVersionCreatedEvent } from "@zeplin/sdk";

import { styleguideComponentHandler } from "./styleguideComponentHandler";

type GetDummyEventParams = {
    action?: string;
    componentId?: string;
    componentName?: string;
    imageUrl?: string;
    timestamp?: number;
}

function getDummyEvent({
    action = "created",
    componentId = "componentId",
    componentName = "componentName",
    imageUrl = "http://placehold.it/200",
    timestamp = 1
}: GetDummyEventParams = {}): StyleguideComponentCreatedEvent | StyleguideComponentVersionCreatedEvent {
    return {
        timestamp,
        action,
        context: {
            styleguide: {
                id: "styleguideId",
                name: "styleguideName"
            }
        },
        resource: {
            id: componentId,
            data: {
                id: componentId,
                name: componentName,
                image: {
                    originalUrl: imageUrl
                }
            }
        }
    } as StyleguideComponentCreatedEvent | StyleguideComponentVersionCreatedEvent;
}

describe("styleguideComponentHandler", () => {
    describe("getTeamsMessage method", () => {
        beforeAll(() => {
            jest.spyOn(Math, "random").mockReturnValue(0);
        });

        it("should images be sorted by timestamp and clamped to contain 5 non-empty urls", () => {
            const result = styleguideComponentHandler.getTeamsMessage([
                getDummyEvent({ timestamp: 6, imageUrl: "url6" }),
                getDummyEvent({ timestamp: 0, imageUrl: "" }),
                getDummyEvent({ timestamp: 5, imageUrl: "url5" }),
                getDummyEvent({ timestamp: 4, imageUrl: "url4" }),
                getDummyEvent({ timestamp: 3, imageUrl: "url3" }),
                getDummyEvent({ timestamp: 1, imageUrl: "url1" }),
                getDummyEvent({ timestamp: 2, imageUrl: "url2" })
            ]);
            const expectedImages = ["url6", "url5", "url4", "url3", "url2"];
            const { sections: [{ images }] } = result;
            expect(images?.map(image => image.image)).toEqual(expectedImages);
        });

        describe("for created event", () => {
            it("should match snapshot when there is only one event", () => {
                expect(styleguideComponentHandler.getTeamsMessage([
                    getDummyEvent()
                ])).toMatchSnapshot();
            });

            it("should match snapshot when there are more than one events", () => {
                expect(styleguideComponentHandler.getTeamsMessage([
                    getDummyEvent(),
                    getDummyEvent({
                        componentId: "componentId2"
                    })
                ])).toMatchSnapshot();
            });
        });

        describe("for version_created event", () => {
            it("should match snapshot when there is only one event", () => {
                expect(styleguideComponentHandler.getTeamsMessage([
                    getDummyEvent({
                        action: "version_created"
                    })
                ])).toMatchSnapshot();
            });

            it("should match snapshot when there are more than one events", () => {
                expect(styleguideComponentHandler.getTeamsMessage([
                    getDummyEvent({
                        action: "version_created"
                    }),
                    getDummyEvent({
                        action: "version_created",
                        componentId: "componentId2"
                    })
                ])).toMatchSnapshot();
            });
        });
    });
});
