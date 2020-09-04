import { projectMemberNotificationHandler } from "./projectMemberNotificationHandler";
import { ProjectMemberEvent } from "../../../../../adapters/zeplin/types";

type GetDummyEventParams = {
    projectName?: string;
    userId?: string;
    userName?: string;
}

function getDummyEvent({
    projectName = "Project MS Teams Integration",
    userId = "userId",
    userName = "dirtybit"
}: GetDummyEventParams = {}): ProjectMemberEvent {
    return {
        payload: {
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
        }
    } as ProjectMemberEvent;
}

describe("projectMemberNotificationHandler", () => {
    describe("getTeamsMessage", () => {
        it("should match snapshot when there is only one event", () => {
            expect(projectMemberNotificationHandler.getTeamsMessage([getDummyEvent()])).toMatchSnapshot();
        });

        it("should match snapshot when there are more than one events", () => {
            expect(projectMemberNotificationHandler.getTeamsMessage([
                getDummyEvent(),
                getDummyEvent({
                    userId: "userId2",
                    userName: "ergunsh"
                })
            ])).toMatchSnapshot();
        });
    });
});
