import { styleguideMemberNotificationHandler } from "./styleguideMemberNotificationHandler";
import { StyleguideMemberInviteEvent } from "../../../../../adapters/zeplin/types";

type GetDummyEventParams = {
    styleguideName?: string;
    userId?: string;
    userName?: string;
}

function getDummyEvent({
    styleguideName = "Styleguide MS Teams Integration",
    userId = "userId",
    userName = "dirtybit"
}: GetDummyEventParams = {}): StyleguideMemberInviteEvent {
    return {
        payload: {
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
        }
    } as StyleguideMemberInviteEvent;
}

describe("styleguideMemberNotificationHandler", () => {
    describe("getTeamsMessage", () => {
        it("should match snapshot when there is only one event", () => {
            expect(styleguideMemberNotificationHandler.getTeamsMessage([getDummyEvent()])).toMatchSnapshot();
        });

        it("should match snapshot when there are more than one events", () => {
            expect(styleguideMemberNotificationHandler.getTeamsMessage([
                getDummyEvent(),
                getDummyEvent({
                    userId: "userId2",
                    userName: "ergunsh"
                })
            ])).toMatchSnapshot();
        });
    });
});
