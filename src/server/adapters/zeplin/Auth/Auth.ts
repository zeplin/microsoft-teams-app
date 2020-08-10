import { Requester } from "../requester";

interface AuthAuthorizeUrlGetParameter {
    query: {
        redirectUri: string;
        clientId: string;
    };
}

interface AuthAccessTokenCreateParameter {
    body: {
        code: string;
        clientSecret: string;
        redirectUri: string;
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

    getAuthorizeUrl(
        {
            query: {
                redirectUri,
                clientId
            }
        }: AuthAuthorizeUrlGetParameter
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
    }: AuthAccessTokenCreateParameter): Promise<AuthToken> {
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
}
