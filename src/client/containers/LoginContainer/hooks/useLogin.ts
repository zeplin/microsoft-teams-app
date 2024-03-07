import { authentication } from "@microsoft/teams-js";
import { useCallback, useState } from "react";

type UseLoginResult = [
    () => void,
    {
        loginError?: string;
    }
]

export const useLogin = (): UseLoginResult => {
    const [loginError] = useState<string|undefined>();

    const login = useCallback(
        () => authentication.authenticate({
            height: 476,
            url: "/api/auth/authorize"
        }),
        []
    );

    return [login, { loginError }];
};
