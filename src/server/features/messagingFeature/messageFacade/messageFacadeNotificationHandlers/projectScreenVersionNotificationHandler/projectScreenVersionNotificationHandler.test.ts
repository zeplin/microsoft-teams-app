import { WebhookEvent } from "server/features/messagingFeature/messagingTypes";
import { ProjectScreenVersionEventPayload, projectScreenVersionNotificationHandler } from "./projectScreenVersionNotificationHandler";
import { ImageSet, CardElementType } from "../teamsCardTemplates";

type GetDummyEventParams = {
    screenId?: string;
    screenName?: string;
    imageUrl?: string;
    commitMessage?: string;
    timestamp?: number;
}

function getDummyEvent({
    screenId = "screenId",
    screenName = "screenName",
    imageUrl = "http://placehold.it/200",
    commitMessage = "",
    timestamp = 1
}: GetDummyEventParams = {}): WebhookEvent<ProjectScreenVersionEventPayload> {
    return {
        payload: {
            action: "created",
            timestamp,
            context: {
                screen: {
                    id: screenId,
                    name: screenName,
                    image: {
                        original_url: imageUrl
                    }
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
        }
    } as WebhookEvent<ProjectScreenVersionEventPayload>;
}

describe("projectScreenVersionNotificationHandler", () => {
    describe("getTeamsMessage", () => {
        it("should images be sorted by timestamp and clamped to contain 5 non-empty urls", () => {
            const result = projectScreenVersionNotificationHandler.getTeamsMessage([
                getDummyEvent({ timestamp: 6, imageUrl: "url6" }),
                getDummyEvent({ timestamp: 0, imageUrl: "" }),
                getDummyEvent({ timestamp: 5, imageUrl: "url5" }),
                getDummyEvent({ timestamp: 4, imageUrl: "url4" }),
                getDummyEvent({ timestamp: 3, imageUrl: "url3" }),
                getDummyEvent({ timestamp: 1, imageUrl: "url1" }),
                getDummyEvent({ timestamp: 2, imageUrl: "url2" })
            ]);
            const expectedImages = ["url6", "url5", "url4", "url3", "url2"];
            const imageSet = result.body.find<ImageSet>(
                (el): el is ImageSet =>
                    el.type === CardElementType.IMAGE_SET
            );
            expect(imageSet.images.map(image => image.url)).toEqual(expectedImages);
        });

        it("should match snapshot when there is only one event", () => {
            expect(projectScreenVersionNotificationHandler.getTeamsMessage([
                getDummyEvent()
            ])).toMatchSnapshot();
        });

        it("should match snapshot when there is a commit message for event", () => {
            expect(projectScreenVersionNotificationHandler.getTeamsMessage([
                getDummyEvent({
                    commitMessage: "Commit ettim commit eyledim bu ekranlari guncellemeye."
                })
            ])).toMatchSnapshot();
        });

        it("should match snapshot when there are more than one events", () => {
            expect(projectScreenVersionNotificationHandler.getTeamsMessage([
                getDummyEvent(),
                getDummyEvent({ screenId: "screenId2" })
            ])).toMatchSnapshot();
        });
    });
});