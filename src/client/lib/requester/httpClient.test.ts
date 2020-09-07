import nock, { Interceptor } from "nock";
import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from "http-status-codes";
import { httpClient } from "./httpClient";
import { storage } from "../storage";

const result = "result";

const defaultAccessToken = "accessToken";
const refreshToken = "refreshToken";

const createMockInterceptor = (token = defaultAccessToken): Interceptor => nock(
    "http://localhost",
    {
        reqheaders: {
            Authorization: `Bearer ${token}`
        }
    }
).get("/");

describe("httpClient", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        nock.cleanAll();
        jest.runAllTimers();
    });

    it("should get the data from server with authentication header", async () => {
        const spyGetAccessToken = jest.spyOn(storage, "getAccessToken").mockReturnValue(defaultAccessToken);
        createMockInterceptor().reply(OK, result);

        const { data } = await httpClient.get("/");

        expect(data).toBe(result);
        spyGetAccessToken.mockRestore();
    });

    it("should get the error from server", async () => {
        const spyGetAccessToken = jest.spyOn(storage, "getAccessToken").mockReturnValue(defaultAccessToken);
        createMockInterceptor().reply(NOT_FOUND, result);

        await expect(() => httpClient.get("/")).rejects.toThrow();
        spyGetAccessToken.mockRestore();
    });

    describe("UNAUTHORIZED errors", () => {
        let spyGetAccessToken: jest.SpyInstance;
        let spyGetRefreshToken: jest.SpyInstance;
        let spyRemoveAccessToken: jest.SpyInstance;
        let spyRemoveRefreshToken: jest.SpyInstance;
        let spySetAccessToken: jest.SpyInstance;
        let spySetRefreshToken: jest.SpyInstance;
        const newAccessToken = "newAccessToken";
        const newRefreshToken = "newRefreshToken";

        beforeEach(() => {
            spyGetAccessToken = jest.spyOn(storage, "getAccessToken")
                .mockReturnValueOnce(defaultAccessToken)
                .mockReturnValueOnce(newAccessToken);
            spyGetRefreshToken = jest.spyOn(storage, "getRefreshToken")
                .mockReturnValue(refreshToken);

            spyRemoveAccessToken = jest.spyOn(storage, "removeAccessToken").mockImplementation();
            spyRemoveRefreshToken = jest.spyOn(storage, "removeRefreshToken").mockImplementation();

            spySetAccessToken = jest.spyOn(storage, "setAccessToken").mockImplementation();
            spySetRefreshToken = jest.spyOn(storage, "setRefreshToken").mockImplementation();
        });

        afterEach(() => {
            spyGetAccessToken.mockRestore();
            spyGetRefreshToken.mockRestore();
            spySetAccessToken.mockRestore();
            spySetRefreshToken.mockRestore();
            spyRemoveAccessToken.mockRestore();
            spyRemoveRefreshToken.mockRestore();
        });

        it("should remove token when it gets a generic UNAUTHORIZED error", async () => {
            createMockInterceptor().reply(UNAUTHORIZED, { detail: "some error" });

            await expect(() => httpClient.get("/")).rejects.toThrow();
            expect(spyRemoveAccessToken).toBeCalledWith();
            expect(spyRemoveRefreshToken).toBeCalledWith();
        });

        it("should refresh token and retry the request when token is expired", async () => {
            createMockInterceptor().reply(UNAUTHORIZED, { detail: "token_expired" });
            createMockInterceptor(newAccessToken).reply(OK, result);

            nock("http://localhost")
                .post("/api/auth/token", { refreshToken })
                .reply(OK, { accessToken: newAccessToken, refreshToken: newRefreshToken });

            const { data } = await httpClient.get("/");

            expect(data).toBe(result);
            expect(spySetAccessToken).toBeCalledWith(newAccessToken);
            expect(spySetRefreshToken).toBeCalledWith(newRefreshToken);
        });

        it("should refresh token and retry the request when token is expired and get AUTHORIZATION error second time", async () => {
            createMockInterceptor().reply(UNAUTHORIZED, { detail: "token_expired" });
            createMockInterceptor(newAccessToken).reply(UNAUTHORIZED, { detail: "some error" });

            nock("http://localhost")
                .post("/api/auth/token", { refreshToken })
                .reply(OK, { accessToken: newAccessToken, refreshToken: newRefreshToken });

            await expect(() => httpClient.get("/")).rejects.toThrow();
            expect(spySetAccessToken).toBeCalledWith(newAccessToken);
            expect(spySetRefreshToken).toBeCalledWith(newRefreshToken);

            expect(spyRemoveAccessToken).toBeCalledWith();
            expect(spyRemoveRefreshToken).toBeCalledWith();
        });

        it("should throw error when refresh token fails", async () => {
            createMockInterceptor().reply(UNAUTHORIZED, { detail: "token_expired" });
            createMockInterceptor(newAccessToken).reply(OK, result);

            nock("http://localhost")
                .post("/api/auth/token", { refreshToken })
                .reply(BAD_REQUEST, result);

            await expect(() => httpClient.get("/")).rejects.toThrow();

            expect(spyRemoveAccessToken).toBeCalledWith();
            expect(spyRemoveRefreshToken).toBeCalledWith();
        });
    });
});
