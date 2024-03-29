import { useEffect, useState } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

interface UseInitializeParams {
    onSuccess?: () => void;
}

interface UseInitializeResult {
    isInitializeLoading: boolean;
}

export const useInitialize = ({ onSuccess }: UseInitializeParams = {}): UseInitializeResult => {
    const [isInitializeLoading, setIsInitializeLoading] = useState(true);
    useEffect(() => {
        // TODO: Convert callback to promise, for more info, please refer to https://aka.ms/teamsfx-callback-to-promise.
        microsoftTeams.app.initialize(() => {
            microsoftTeams.app.notifySuccess();
            setIsInitializeLoading(false);
            onSuccess?.();
        });
    }, []);
    return { isInitializeLoading };
};
