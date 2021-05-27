import { projectNoteHandler } from "./projectNoteHandler";
import { ProjectNoteCreatedEvent } from "@zeplin/sdk";

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
    projectName = "Project Microsoft Teams Integration",
    screenId = "screenId",
    screenName = "Manage Zeplin Connector",
    username = "sertac",
    noteId = "noteId",
    commentContent = "Naptin nettin nettin naptin?"
}: GetDummyEventParams = {}): ProjectNoteCreatedEvent {
    return {
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
    } as ProjectNoteCreatedEvent;
}

describe("projectNoteHandler", () => {
    describe("getTeamsMessage", () => {
        beforeAll(() => {
            jest.spyOn(Math, "random").mockReturnValue(0);
        });

        it("should match snapshot", () => {
            expect(projectNoteHandler.getTeamsMessage([getDummyEvent()])).toMatchSnapshot();
        });
    });
});
