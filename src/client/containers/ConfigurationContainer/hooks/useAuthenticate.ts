import { useCallback } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

type VoidFunction = () => void;

interface UseAuthenticateParams {
    onSuccess: (value: string) => void;
}

export const useAuthenticate = ({ onSuccess }: UseAuthenticateParams): VoidFunction => useCallback(
    () => {
        microsoftTeams.authentication.authenticate({
            height: 476,
            successCallback: onSuccess,
            url: "/api/auth/authorize"
        });
    },
    []
);
