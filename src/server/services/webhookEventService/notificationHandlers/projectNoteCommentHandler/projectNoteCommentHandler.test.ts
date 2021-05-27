import { ProjectNoteCommentCreatedEvent } from "@zeplin/sdk";

import { projectNoteCommentHandler } from "./projectNoteCommentHandler";

type GetDummyEventParams = {
    projectId?: string;
    projectName?: string;
    screenId?: string;
    screenName?: string;
    username?: string;
    noteId?: string;
    noteOrder?: number;
    commentId?: string;
    commentContent?: string;
}

function getDummyEvent({
    projectId = "projectId",
    projectName = "Project Microsoft Teams Integration",
    screenId = "screenId",
    screenName = "Manage Zeplin Connector",
    username = "sertac",
    noteId = "noteId",
    noteOrder = 1,
    commentId = "commentId",
    commentContent = "cok guzel keyfimiz var"
}: GetDummyEventParams = {}): ProjectNoteCommentCreatedEvent {
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
            },
            note: {
                id: noteId,
                order: noteOrder
            }
        },
        actor: {
            user: {
                username
            }
        },
        resource: {
            id: commentId,
            data: {
                id: commentId,
                content: commentContent
            }
        }
    } as ProjectNoteCommentCreatedEvent;
}

describe("projectNoteHandler", () => {
    describe("getTeamsMessage", () => {
        beforeAll(() => {
            jest.spyOn(Math, "random").mockReturnValue(0);
        });

        it("should match snapshot", () => {
            expect(projectNoteCommentHandler.getTeamsMessage([getDummyEvent()])).toMatchSnapshot();
        });
    });
});
