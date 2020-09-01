import { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

interface UseInitializeParams {
    onSuccess: () => void;
}

export const useInitialize = ({ onSuccess }: UseInitializeParams): void => {
    useEffect(() => {
        microsoftTeams.initialize(() => {
            microsoftTeams.appInitialization.notifySuccess();
            onSuccess();
        });
    }, []);
};
