import { Webhooks } from "./Webhooks";
import { Requester } from "../requester";

const secret = "dummy-secret";

describe("Zeplin > Webhooks", () => {
    let webhooks: Webhooks;
    beforeAll(() => {
        webhooks = new Webhooks(new Requester({ baseURL: "http://localhost/v1" }));
    });

    describe("verifyWebhookEvent", () => {
        it("should return false when given signature doesn't match the generated signature", () => {
            const signature = "not-matching-signature";
            const deliveryTimestamp = 1598429130;
            const payload = {};
            expect(webhooks.verifyWebhookEvent({ signature, deliveryTimestamp, secret, payload })).toBe(false);
        });

        it("should return true when given signature matches the generated signature", () => {
            const signature = "e60b960f6d839f9124a7ccf0f30c8803543abcf369cc3c8803c7226df329f145";
            const deliveryTimestamp = 1598429130;
            const payload = {};
            expect(webhooks.verifyWebhookEvent({ signature, deliveryTimestamp, secret, payload })).toBe(true);
        });
    });
});
