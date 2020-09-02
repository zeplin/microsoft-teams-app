import { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

interface UseValidateParams {
    valid: boolean;
    enabled: boolean;
}

export const useValidate = ({ valid, enabled }: UseValidateParams): void => {
    useEffect(() => {
        if (enabled) {
            microsoftTeams.settings.setValidityState(valid);
        }
    }, [valid, enabled]);
};
