import { Requester } from "../requester";

interface AuthAuthorizationUrlGetParameter {
    query: {
        redirectUri: string;
        clientId: string;
    };
}

interface AuthTokenCreateParameter {
    body: {
        code: string;
        clientSecret: string;
        redirectUri: string;
        clientId: string;
    };
}

interface AuthTokenRefreshParameter {
    body: {
        refreshToken: string;
        clientSecret: string;
        clientId: string;
    };
}

export interface AuthToken {
    accessToken: string;
    refreshToken: string;
}

export class Auth {
    private readonly requester: Requester;

    constructor(requester: Requester) {
        this.requester = requester;
    }

    getAuthorizationUrl(
        {
            query: {
                redirectUri,
                clientId
            }
        }: AuthAuthorizationUrlGetParameter
    ): string {
        return this.requester.getUri({
            url: "/oauth/authorize",
            params: {
                redirect_uri: redirectUri,
                client_id: clientId,
                response_type: "code"
            }
        });
    }

    async createToken({
        body: {
            code,
            clientId,
            clientSecret,
            redirectUri
        }
    }: AuthTokenCreateParameter): Promise<AuthToken> {
        const { access_token: accessToken, refresh_token: refreshToken } = await this.requester.post(
            "/oauth/token",
            {
                grant_type: "authorization_code",
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri
            }
        );
        return {
            accessToken,
            refreshToken
        };
    }

    async refreshToken({
        body: {
            refreshToken,
            clientId,
            clientSecret
        }
    }: AuthTokenRefreshParameter): Promise<AuthToken> {
        const { access_token, refresh_token } = await this.requester.post(
            "/oauth/token",
            {
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: clientId,
                client_secret: clientSecret
            }
        );
        return {
            accessToken: access_token,
            refreshToken: refresh_token
        };
    }
}
