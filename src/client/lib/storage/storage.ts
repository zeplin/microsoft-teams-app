
const accessTokenKey = "@zeplin/microsoft-teams-app:accessToken";
const refreshTokenKey = "@zeplin/microsoft-teams-app:refreshToken";

const memoryStorage = {};

const setItem = (key: string, value: string): void => {
    try {
        memoryStorage[key] = value;
        localStorage.setItem(key, value);
    } catch (error) {
        // Do nothing
    }
};

const getItem = (key: string): string|undefined => {
    try {
        return memoryStorage[key] || localStorage.getItem(key);
    } catch (e) {
        return memoryStorage[key];
    }
};

export const getAccessToken = (): string|undefined => getItem(accessTokenKey);
export const setAccessToken = (value: string): void => setItem(accessTokenKey, value);

export const getRefreshToken = (): string|undefined => getItem(refreshTokenKey);
export const setRefreshToken = (value: string): void => setItem(refreshTokenKey, value);