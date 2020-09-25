import { projectNoteHandler } from "./projectNoteHandler";
import { NoteCreateEvent } from "../../../../adapters/zeplin/types";

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
}: GetDummyEventParams = {}): NoteCreateEvent {
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
    } as NoteCreateEvent;
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
