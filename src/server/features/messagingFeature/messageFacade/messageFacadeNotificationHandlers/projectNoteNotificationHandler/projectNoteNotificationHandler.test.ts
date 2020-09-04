import { projectNoteNotificationHandler } from "./projectNoteNotificationHandler";
import { ProjectNoteEvent } from "../../../../../adapters/zeplin/types";

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
}: GetDummyEventParams = {}): ProjectNoteEvent {
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
    } as ProjectNoteEvent;
}

describe("projectNoteNotificationHandler", () => {
    describe("getTeamsMessage", () => {
        it("should match snapshot", () => {
            expect(projectNoteNotificationHandler.getTeamsMessage([getDummyEvent()])).toMatchSnapshot();
        });
    });
});
