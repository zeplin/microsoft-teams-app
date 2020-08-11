import { zeplin } from "../../adapters/zeplin";
import { ZEPLIN_CLIENT_ID, ZEPLIN_CLIENT_SECRET, BASE_URL } from "../../config";
import { AuthToken } from "../../adapters/zeplin/Auth";

const REDIRECT_URI = `${BASE_URL}/zeplin/auth/end`;

class AuthFacade {
    getAuthorizationUrl(): string {
        return zeplin.auth.getAuthorizationUrl({
            query: {
                redirectUri: REDIRECT_URI,
                clientId: ZEPLIN_CLIENT_ID
            }
        });
    }

    createToken(code: string): Promise<AuthToken> {
        return zeplin.auth.createToken({
            body: {
                code,
                clientId: ZEPLIN_CLIENT_ID,
                clientSecret: ZEPLIN_CLIENT_SECRET,
                redirectUri: REDIRECT_URI
            }
        });
    }
}

export const authFacade = new AuthFacade();
