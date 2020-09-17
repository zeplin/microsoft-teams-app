import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from "http-status-codes";
import { httpClient } from "./httpClient";
import { storage } from "../storage";

const result = { result: "result" };

const defaultAccessToken = "accessToken";
const refreshToken = "refreshToken";

describe("httpClient", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runAllTimers();
        if (global.fetch) {
            (global.fetch as jest.Mock).mockRestore();
            delete global.fetch;
        }
    });

    it("should get the data from server with authentication header", async () => {
        const spyGetAccessToken = jest.spyOn(storage, "getAccessToken").mockReturnValue(defaultAccessToken);

        global.fetch = jest.fn().mockResolvedValue({
            status: OK,
            json: () => Promise.resolve(result)
        });

        const data = await httpClient.get("/");

        expect(data).toStrictEqual(result);
        spyGetAccessToken.mockRestore();
    });

    it("should get the error from server", async () => {
        const spyGetAccessToken = jest.spyOn(storage, "getAccessToken").mockReturnValue(defaultAccessToken);

        global.fetch = jest.fn().mockResolvedValue({
            status: NOT_FOUND,
            json: () => Promise.resolve({ detail: "not found" })
        });

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
            global.fetch = jest.fn().mockResolvedValue({
                status: UNAUTHORIZED,
                json: () => Promise.resolve({ detail: "some error" })
            });

            await expect(() => httpClient.get("/")).rejects.toThrow();
            expect(spyRemoveAccessToken).toBeCalledWith();
            expect(spyRemoveRefreshToken).toBeCalledWith();
        });

        it("should refresh token and retry the request when token is expired", async () => {
            global.fetch = jest.fn().mockImplementation((url, { headers: { Authorization }, body }) => {
                if (url === "/" && Authorization === `Bearer ${newAccessToken}`) {
                    return {
                        status: OK,
                        json: () => Promise.resolve(result)
                    } as Response;
                }
                if (url === "/api/auth/token" && body === JSON.stringify({ refreshToken })) {
                    return {
                        status: OK,
                        json: () => Promise.resolve({
                            accessToken: newAccessToken,
                            refreshToken: newRefreshToken
                        })
                    } as Response;
                }
                return {
                    status: UNAUTHORIZED,
                    json: () => Promise.resolve({ detail: "token_expired" })
                } as Response;
            });

            const data = await httpClient.get("/");

            expect(data).toStrictEqual(result);
            expect(spySetAccessToken).toBeCalledWith(newAccessToken);
            expect(spySetRefreshToken).toBeCalledWith(newRefreshToken);
        });

        it("should refresh token and retry the request when token is expired and get AUTHORIZATION error second time", async () => {
            global.fetch = jest.fn().mockImplementation((url, { headers: { Authorization }, body }) => {
                if (url === "/" && Authorization === `Bearer ${newAccessToken}`) {
                    return {
                        status: UNAUTHORIZED,
                        json: () => Promise.resolve({ detail: "some error" })
                    } as Response;
                }
                if (url === "/api/auth/token" && body === JSON.stringify({ refreshToken })) {
                    return {
                        status: OK,
                        json: () => Promise.resolve({
                            accessToken: newAccessToken,
                            refreshToken: newRefreshToken
                        })
                    } as Response;
                }
                return {
                    status: UNAUTHORIZED,
                    json: () => Promise.resolve({ detail: "token_expired" })
                } as Response;
            });

            await expect(() => httpClient.get("/")).rejects.toThrow();
            expect(spySetAccessToken).toBeCalledWith(newAccessToken);
            expect(spySetRefreshToken).toBeCalledWith(newRefreshToken);

            expect(spyRemoveAccessToken).toBeCalledWith();
            expect(spyRemoveRefreshToken).toBeCalledWith();
        });

        it("should throw error when refresh token fails", async () => {
            global.fetch = jest.fn().mockImplementation((url, { body }) => {
                if (url === "/api/auth/token" && body === JSON.stringify({ refreshToken })) {
                    return {
                        status: BAD_REQUEST,
                        json: () => Promise.resolve({ detail: "some error" })
                    } as Response;
                }
                return {
                    status: UNAUTHORIZED,
                    json: () => Promise.resolve({ detail: "token_expired" })
                } as Response;
            });

            await expect(() => httpClient.get("/")).rejects.toThrow();

            expect(spyRemoveAccessToken).toBeCalledWith();
            expect(spyRemoveRefreshToken).toBeCalledWith();
        });
    });
});
