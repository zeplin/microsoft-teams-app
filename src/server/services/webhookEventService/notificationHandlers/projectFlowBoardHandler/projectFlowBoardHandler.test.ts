import { ProjectFlowBoardBuiltEvent } from "@zeplin/sdk";

import { projectFlowBoardHandler } from "./projectFlowBoardHandler";

type GetDummyEventParams = {
    action?: string;
    flowBoardId?: string;
}

function getDummyEvent({
    action = "built",
    flowBoardId = "flowBoardId"
}: GetDummyEventParams = {}): ProjectFlowBoardBuiltEvent {
    return {
        action,
        context: {
            project: {
                id: "projectId",
                name: "projectName"
            }
        },
        actor: {
            user: {
                username: "testUsername"
            }
        },
        resource: {
            id: flowBoardId,
            type: "FlowBoard",
            data: {
                id: flowBoardId
            }
        }
    } as ProjectFlowBoardBuiltEvent;
}

describe("projectBoardHandler", () => {
    describe("getTeamsMessage method", () => {
        beforeAll(() => {
            jest.spyOn(Math, "random").mockReturnValue(0);
        });

        describe("for created notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    projectFlowBoardHandler.getTeamsMessage([getDummyEvent()])
                ).toMatchSnapshot();
            });
        });
    });
});
