import { WebhookEvent } from "../../../messagingTypes";
import {
    styleguideColorNotificationHandler,
    StyleguideColorEventPayload
} from "./styleguideColorNotificationHandler";

const dummyEvent = {
    payload: {
        action: "created",
        context: {
            styleguide: {
                id: "styleguideId"
            }
        },
        resource: {
            id: "colorId",
            data: {
                id: "colorId",
                name: "ColorName"
            }
        }
    }
} as WebhookEvent<StyleguideColorEventPayload>;
describe("styleguideColorNotificationHandler", () => {
    describe("getTeamsMessage method", () => {
        describe("for created notification", () => {
            it("should match snapshot when there is only 1 event", () => {
                expect(
                    styleguideColorNotificationHandler.getTeamsMessage([dummyEvent])
                ).toMatchSnapshot();
            });
        });
    });
});
