import { projectScreenVersionHandler } from "./projectScreenVersionHandler";
import { ProjectScreenVersionCreatedEvent } from "@zeplin/sdk";

type GetDummyEventParams = {
    screenId?: string;
    screenName?: string;
    screenVariant?: {
        value: string;
        group: {
            id: string;
            name: string;
        };
    };
    imageUrl?: string;
    commitMessage?: string;
    timestamp?: number;
}

function getDummyEvent({
    screenId = "screenId",
    screenName = "screenName",
    screenVariant = undefined,
    imageUrl = "http://placehold.it/200",
    commitMessage = "",
    timestamp = 1
}: GetDummyEventParams = {}): ProjectScreenVersionCreatedEvent {
    return {
        action: "created",
        timestamp,
        context: {
            screen: {
                id: screenId,
                name: screenName,
                image: {
                    thumbnails: {
                        small: imageUrl
                    }
                },
                variant: screenVariant
            },
            project: {
                id: "projectId",
                name: "projectName"
            }
        },
        resource: {
            data: {
                commit: {
                    message: commitMessage
                }
            }
        }
    } as ProjectScreenVersionCreatedEvent;
}

describe("projectScreenVersionHandler", () => {
    describe("getTeamsMessage", () => {
        beforeAll(() => {
            jest.spyOn(Math, "random").mockReturnValue(0);
        });

        it("should images be sorted by timestamp and clamped to contain 5 non-empty urls", () => {
            const result = projectScreenVersionHandler.getTeamsMessage([
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

        it("should match snapshot when there is only one event", () => {
            expect(projectScreenVersionHandler.getTeamsMessage([
                getDummyEvent()
            ])).toMatchSnapshot();
        });

        it("should match snapshot when there is a commit message for event", () => {
            expect(projectScreenVersionHandler.getTeamsMessage([
                getDummyEvent({
                    commitMessage: "Commit ettim commit eyledim bu ekranlari guncellemeye."
                })
            ])).toMatchSnapshot();
        });

        it("should match snapshot when there are more than one events", () => {
            expect(projectScreenVersionHandler.getTeamsMessage([
                getDummyEvent(),
                getDummyEvent({ screenId: "screenId2" })
            ])).toMatchSnapshot();
        });

        it("should match snapshot when there is screen variant", () => {
            expect(projectScreenVersionHandler.getTeamsMessage([
                getDummyEvent({
                    screenVariant: {
                        value: "Dark",
                        group: {
                            id: "screenVariantGroupId",
                            name: "Manage Zeplin Connector"
                        }
                    }
                })
            ])).toMatchSnapshot();
        });

        it("should match snapshot when there are more than one events from the same screen variant group", () => {
            expect(projectScreenVersionHandler.getTeamsMessage([
                getDummyEvent({
                    screenVariant: {
                        value: "Dark",
                        group: {
                            id: "screenVariantGroupId",
                            name: "Manage Zeplin Connector"
                        }
                    }
                }),
                getDummyEvent({
                    screenVariant: {
                        value: "Mobile",
                        group: {
                            id: "screenVariantGroupId",
                            name: "Manage Zeplin Connector"
                        }
                    }
                })
            ])).toMatchSnapshot();
        });

        it("should match snapshot when there are more than one events from different screen variant groups", () => {
            expect(projectScreenVersionHandler.getTeamsMessage([
                getDummyEvent({
                    screenVariant: {
                        value: "Dark",
                        group: {
                            id: "screenVariantGroupId",
                            name: "Manage Zeplin Connector"
                        }
                    }
                }),
                getDummyEvent({
                    screenVariant: {
                        value: "Mobile",
                        group: {
                            id: "screenVariantGroup2Id",
                            name: "Manage Zeplin Connector"
                        }
                    }
                })
            ])).toMatchSnapshot();
        });

        it("should match snapshot when there are more than one events from screen variant groups with one without a variant group", () => {
            expect(projectScreenVersionHandler.getTeamsMessage([
                getDummyEvent({
                    screenVariant: {
                        value: "Dark",
                        group: {
                            id: "screenVariantGroupId",
                            name: "Manage Zeplin Connector"
                        }
                    }
                }),
                getDummyEvent()
            ])).toMatchSnapshot();
        });
    });
});
