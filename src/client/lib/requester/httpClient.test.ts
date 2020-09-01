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

    it("should refresh token and retry the request when token is expired", async () => {
        const newAccessToken = "newAccessToken";
        const newRefreshToken = "newRefreshToken";

        const spyGetAccessToken = jest.spyOn(storage, "getAccessToken")
            .mockReturnValueOnce(defaultAccessToken)
            .mockReturnValueOnce(newAccessToken);
        const spyGetRefreshToken = jest.spyOn(storage, "getRefreshToken")
            .mockReturnValue(refreshToken);

        const spySetAccessToken = jest.spyOn(storage, "setAccessToken").mockImplementation();
        const spySetRefreshToken = jest.spyOn(storage, "setRefreshToken").mockImplementation();

        createMockInterceptor().reply(UNAUTHORIZED, { detail: "token_expired" });
        createMockInterceptor(newAccessToken).reply(OK, result);

        nock("http://localhost")
            .post("/api/auth/token", { refreshToken })
            .reply(OK, { accessToken: newAccessToken, refreshToken: newRefreshToken });

        const { data } = await httpClient.get("/");

        expect(data).toBe(result);
        expect(spySetAccessToken).toBeCalledWith(newAccessToken);
        expect(spySetRefreshToken).toBeCalledWith(newRefreshToken);

        spyGetAccessToken.mockRestore();
        spyGetRefreshToken.mockRestore();
        spySetAccessToken.mockRestore();
        spySetRefreshToken.mockRestore();
    });

    it("should throw error when refresh token fails", async () => {
        const newAccessToken = "newAccessToken";
        const spyGetAccessToken = jest.spyOn(storage, "getAccessToken")
            .mockReturnValueOnce(defaultAccessToken)
            .mockReturnValueOnce(newAccessToken);
        const spyGetRefreshToken = jest.spyOn(storage, "getRefreshToken")
            .mockReturnValue(refreshToken);

        createMockInterceptor().reply(UNAUTHORIZED, { detail: "token_expired" });
        createMockInterceptor(newAccessToken).reply(OK, result);

        nock("http://localhost")
            .post("/api/auth/token", { refreshToken })
            .reply(BAD_REQUEST, result);

        await expect(() => httpClient.get("/")).rejects.toThrow();

        spyGetAccessToken.mockRestore();
        spyGetRefreshToken.mockRestore();
    });
});
