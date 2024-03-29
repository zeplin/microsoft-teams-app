import { authentication } from "@microsoft/teams-js";
import { useCallback, useState } from "react";

interface UseLoginParams {
    onSuccess: (code?: string) => Promise<void>;
}

type UseLoginResult = [
    () => void,
    {
        loginError?: string;
    }
]

const errorToText = (error?: string): string => {
    switch (error) {
        case "CancelledByUser":
        case "access_denied":
            return "You need to authorize Microsoft Teams app to connect your Zeplin projects and styleguides.";
        default:
            return "Authorization failed due to an API related connectivity issue. Please retry logging in.";
    }
};

export const useLogin = ({ onSuccess }: UseLoginParams): UseLoginResult => {
    const [loginError, setError] = useState<string|undefined>();

    const login = useCallback(
        async () => {
            try {
                // TODO: Check output
                const authenticateResult = await authentication.authenticate({
                    height: 476,
                    url: "/api/auth/authorize"
                });
                onSuccess();
                return authenticateResult;
            } catch (err: unknown) {
                setError(errorToText((err as Error)?.message || "Authenticate Error"));
            }
        },
        []
    );

    return [login, { loginError }];
};
