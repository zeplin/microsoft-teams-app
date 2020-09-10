import { zeplin } from "../../adapters";
import { ZEPLIN_CLIENT_ID, ZEPLIN_CLIENT_SECRET, BASE_URL } from "../../config";

const REDIRECT_URI = `${BASE_URL}/zeplin/auth/end`;

type TokenCreateParams = {
    code: string;
} | {
    refreshToken: string;
}

interface AuthToken {
    accessToken: string;
    refreshToken: string;
}

class AuthService {
    getAuthorizationUrl(): string {
        return zeplin.auth.getAuthorizationUrl({
            query: {
                redirectUri: REDIRECT_URI,
                clientId: ZEPLIN_CLIENT_ID as string
            }
        });
    }

    createToken(params: TokenCreateParams): Promise<AuthToken> {
        if ("code" in params) {
            return zeplin.auth.createToken({
                body: {
                    code: params.code,
                    clientId: ZEPLIN_CLIENT_ID as string,
                    clientSecret: ZEPLIN_CLIENT_SECRET as string,
                    redirectUri: REDIRECT_URI
                }
            });
        }
        return zeplin.auth.refreshToken({
            body: {
                refreshToken: params.refreshToken,
                clientId: ZEPLIN_CLIENT_ID as string,
                clientSecret: ZEPLIN_CLIENT_SECRET as string
            }
        });
    }
}

export const authService = new AuthService();
