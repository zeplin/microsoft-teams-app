import { ProjectMemberInvitedEvent } from "@zeplin/sdk";

import { projectMemberHandler } from "./projectMemberHandler";

type GetDummyEventParams = {
    projectName?: string;
    userId?: string;
    userName?: string;
}

function getDummyEvent({
    projectName = "Project Microsoft Teams Integration",
    userId = "userId",
    userName = "dirtybit"
}: GetDummyEventParams = {}): ProjectMemberInvitedEvent {
    return {
        action: "invited",
        context: {
            project: {
                id: "projectId",
                name: projectName
            }
        },
        resource: {
            data: {
                user: {
                    id: userId,
                    username: userName
                }
            }
        }
    } as ProjectMemberInvitedEvent;
}

describe("projectMemberHandler", () => {
    describe("getTeamsMessage", () => {
        it("should match snapshot when there is only one event", () => {
            expect(projectMemberHandler.getTeamsMessage([getDummyEvent()])).toMatchSnapshot();
        });

        it("should match snapshot when there are more than one events", () => {
            expect(projectMemberHandler.getTeamsMessage([
                getDummyEvent(),
                getDummyEvent({
                    userId: "userId2",
                    userName: "ergunsh"
                })
            ])).toMatchSnapshot();
        });
    });
});
