import { projectNoteHandler } from "./projectNoteHandler";
import { ProjectNoteCreatedEvent } from "@zeplin/sdk";

type GetDummyEventParams = {
    projectId?: string;
    projectName?: string;
    screenId?: string;
    screenName?: string;
    screenVariant?: {
        value: string;
        group: {
            id: string;
            name: string;
        };
    };
    username?: string;
    noteId?: string;
    commentContent?: string;
}

function getDummyEvent({
    projectId = "projectId",
    projectName = "Project Microsoft Teams Integration",
    screenId = "screenId",
    screenName = "Manage Zeplin Connector",
    screenVariant = undefined,
    username = "sertac",
    noteId = "noteId",
    commentContent = "Naptin nettin nettin naptin?"
}: GetDummyEventParams = {}): ProjectNoteCreatedEvent {
    return {
        action: "created",
        context: {
            screen: {
                id: screenId,
                name: screenName,
                variant: screenVariant
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

        it("should match snapshot with screen variant", () => {
            expect(projectNoteHandler.getTeamsMessage([getDummyEvent({
                screenVariant: {
                    value: "Dark",
                    group: {
                        id: "screenVariantGroupId",
                        name: "Manage Zeplin Connector"
                    }
                }
            })])).toMatchSnapshot();
        });
    });
});
