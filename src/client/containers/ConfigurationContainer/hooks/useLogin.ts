import * as microsoftTeams from "@microsoft/teams-js";
import { useCallback, useState } from "react";

interface UseAuthenticateParams {
    onSuccess: () => void;
}

type UseAuthenticateResult = [
    () => void,
    {
        loginError?: string;
    }
]

const errorToText = (error: string): string => {
    switch (error) {
        case "CancelledByUser":
        case "access_denied":
            return "You need to authorize Teams app to connect your Zeplin projects and styleguides.";
        default:
            return "Authorization failed due to an API related connectivity issue. Retry log in.";
    }
};

export const useLogin = ({ onSuccess }: UseAuthenticateParams): UseAuthenticateResult => {
    const [loginError, setError] = useState<string|undefined>();

    const login = useCallback(
        () => microsoftTeams.authentication.authenticate({
            height: 476,
            successCallback: onSuccess,
            failureCallback: value => setError(errorToText(value)),
            url: "/api/auth/authorize"
        }),
        []
    );

    return [login, { loginError }];
};
