import express from "express";
import request from "supertest";
import { BAD_REQUEST, PERMANENT_REDIRECT } from "http-status-codes";
import { initMacAppRedirectLinksFeature } from "./macAppRedirectLinksFeature";
import { ZEPLIN_MAC_APP_URL_SCHEME } from "../../config";

function getRequester(): request.SuperTest<request.Test> {
    const app = express();
    initMacAppRedirectLinksFeature(app);
    return request(app);
}

let requester: request.SuperTest<request.Test>;
describe("macAppRedirectLinksFeature", () => {
    beforeAll(() => {
        requester = getRequester();
    });
    describe("/app-redirect endpoint", () => {
        it("should return 400 when uri query param is not provided", async () => {
            const result = await requester.get("/app-redirect");
            expect(result.status).toBe(BAD_REQUEST);
        });

        it("should return 400 when uri query param is not a valid URI", async () => {
            const result = await requester.get("/app-redirect?uri=not-a-valid-uri");
            expect(result.status).toBe(BAD_REQUEST);
        });

        it(`should return 400 when uri query param's scheme is different than ${ZEPLIN_MAC_APP_URL_SCHEME}`, async () => {
            const result = await requester.get(`/app-redirect?uri=${encodeURIComponent("https://ergun.sh")}`);
            expect(result.status).toBe(BAD_REQUEST);
        });

        it(`should return 308 when uri query param's scheme is ${ZEPLIN_MAC_APP_URL_SCHEME}`, async () => {
            const result = await requester.get(`/app-redirect?uri=${encodeURIComponent(`${ZEPLIN_MAC_APP_URL_SCHEME}colors?pid=pid&cids=cid1,cid2`)}`);
            expect(result.status).toBe(PERMANENT_REDIRECT);
        });
    });
});