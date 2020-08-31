
const accessTokenKey = "@zeplin/microsoft-teams-app:accessToken";
const refreshTokenKey = "@zeplin/microsoft-teams-app:refreshToken";

export const getAccessToken = (): string|undefined => localStorage.getItem(accessTokenKey);
export const setAccessToken = (value: string): void => localStorage.setItem(accessTokenKey, value);

export const getRefreshToken = (): string|undefined => localStorage.getItem(refreshTokenKey);
export const setRefreshToken = (value: string): void => localStorage.setItem(refreshTokenKey, value);
