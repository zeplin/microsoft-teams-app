import { Zeplin } from "../../adapters";
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
    zeplin = new Zeplin();

    getAuthorizationUrl(): string {
        return this.zeplin.authorization.getAuthorizationUrl({
            redirectUri: REDIRECT_URI,
            clientId: ZEPLIN_CLIENT_ID as string
        });
    }

    async createToken(params: TokenCreateParams): Promise<AuthToken> {
        if ("code" in params) {
            const { data } = await this.zeplin.authorization.createToken({
                code: params.code,
                clientId: ZEPLIN_CLIENT_ID as string,
                clientSecret: ZEPLIN_CLIENT_SECRET as string,
                redirectUri: REDIRECT_URI
            });
            return data;
        }
        const { data } = await this.zeplin.authorization.refreshToken({
            refreshToken: params.refreshToken,
            clientId: ZEPLIN_CLIENT_ID as string,
            clientSecret: ZEPLIN_CLIENT_SECRET as string
        });
        return data;
    }
}

export const authService = new AuthService();
