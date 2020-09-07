import { zeplin } from "../../adapters/zeplin";
import { ZEPLIN_CLIENT_ID, ZEPLIN_CLIENT_SECRET, BASE_URL } from "../../config";
import { AuthToken } from "../../adapters/zeplin/Auth";

const REDIRECT_URI = `${BASE_URL}/zeplin/auth/end`;

type TokenCreateParams = {
    code: string;
} | {
    refreshToken: string;
}

class AuthService {
    getAuthorizationUrl(): string {
        return zeplin.auth.getAuthorizationUrl({
            query: {
                redirectUri: REDIRECT_URI,
                clientId: ZEPLIN_CLIENT_ID
            }
        });
    }

    createToken(params: TokenCreateParams): Promise<AuthToken> {
        if ("code" in params) {
            return zeplin.auth.createToken({
                body: {
                    code: params.code,
                    clientId: ZEPLIN_CLIENT_ID,
                    clientSecret: ZEPLIN_CLIENT_SECRET,
                    redirectUri: REDIRECT_URI
                }
            });
        }
        return zeplin.auth.refreshToken({
            body: {
                refreshToken: params.refreshToken,
                clientId: ZEPLIN_CLIENT_ID,
                clientSecret: ZEPLIN_CLIENT_SECRET
            }
        });
    }
}

export const authService = new AuthService();
