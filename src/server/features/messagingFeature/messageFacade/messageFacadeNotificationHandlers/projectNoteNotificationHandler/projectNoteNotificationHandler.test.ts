import { WebhookEvent } from "../../../messagingTypes";
import { ProjectNoteEventPayload, projectNoteNotificationHandler } from "./projectNoteNotificationHandler";

type GetDummyEventParams = {
    projectId?: string;
    projectName?: string;
    screenId?: string;
    screenName?: string;
    username?: string;
    noteId?: string;
    commentContent?: string;
}

function getDummyEvent({
    projectId = "projectId",
    projectName = "Project MS Teams Integration",
    screenId = "screenId",
    screenName = "Manage Zeplin Connector",
    username = "sertac",
    noteId = "noteId",
    commentContent = "Naptin nettin nettin naptin?"
}: GetDummyEventParams = {}): WebhookEvent<ProjectNoteEventPayload> {
    return {
        payload: {
            action: "created",
            context: {
                screen: {
                    id: screenId,
                    name: screenName
                },
                project: {
                    id: projectId,
                    name: projectName
                }
            },
            actor: {
                user: {
                    username
                }
            },
            resource: {
                id: noteId,
                data: {
                    id: noteId,
                    comments: [{
                        content: commentContent
                    }]
                }
            }
        }
    } as WebhookEvent<ProjectNoteEventPayload>;
}

describe("projectNoteNotificationHandler", () => {
    describe("getTeamsMessage", () => {
        it("should match snapshot", () => {
            expect(projectNoteNotificationHandler.getTeamsMessage([getDummyEvent()])).toMatchSnapshot();
        });
    });
});