import { styleguideMemberHandler } from "./styleguideMemberHandler";
import { StyleguideMemberInvitedEvent } from "@zeplin/sdk";

type GetDummyEventParams = {
    styleguideName?: string;
    userId?: string;
    userName?: string;
}

function getDummyEvent({
    styleguideName = "Styleguide Microsoft Teams Integration",
    userId = "userId",
    userName = "dirtybit"
}: GetDummyEventParams = {}): StyleguideMemberInvitedEvent {
    return {
        action: "invited",
        context: {
            styleguide: {
                id: "styleguideId",
                name: styleguideName
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
    } as StyleguideMemberInvitedEvent;
}

describe("styleguideMemberHandler", () => {
    describe("getTeamsMessage", () => {
        it("should match snapshot when there is only one event", () => {
            expect(styleguideMemberHandler.getTeamsMessage([getDummyEvent()])).toMatchSnapshot();
        });

        it("should match snapshot when there are more than one events", () => {
            expect(styleguideMemberHandler.getTeamsMessage([
                getDummyEvent(),
                getDummyEvent({
                    userId: "userId2",
                    userName: "ergunsh"
                })
            ])).toMatchSnapshot();
        });
    });
});
