import { projectScreenNotificationHandler } from "./projectScreenNotificationHandler";
import { ProjectScreenEvent } from "../../../../../adapters/zeplin/types";

type GetDummyEventParams = {
    screenId?: string;
    screenName?: string;
    imageUrl?: string;
    timestamp?: number;
}

function getDummyEvent({
    screenId = "screenId",
    screenName = "screenName",
    imageUrl = "http://placehold.it/200",
    timestamp = 1
}: GetDummyEventParams = {}): ProjectScreenEvent {
    return {
        payload: {
            action: "created",
            timestamp,
            context: {
                project: {
                    id: "projectId",
                    name: "projectName"
                }
            },
            resource: {
                id: screenId,
                data: {
                    id: screenId,
                    name: screenName,
                    image: {
                        original_url: imageUrl
                    }
                }
            }
        }
    } as ProjectScreenEvent;
}

describe("projectScreenNotificationHandler", () => {
    describe("getTeamsMessage", () => {
        it("should images be sorted by timestamp and clamped to contain 5 non-empty urls", () => {
            const result = projectScreenNotificationHandler.getTeamsMessage([
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
            expect(images.map(image => image.image)).toEqual(expectedImages);
        });

        it("should match snapshot when there is only one event", () => {
            expect(projectScreenNotificationHandler.getTeamsMessage([
                getDummyEvent()
            ])).toMatchSnapshot();
        });

        it("should match snapshot when there are more than one events", () => {
            expect(projectScreenNotificationHandler.getTeamsMessage([
                getDummyEvent(),
                getDummyEvent({ screenId: "screenId2" })
            ])).toMatchSnapshot();
        });
    });
});
