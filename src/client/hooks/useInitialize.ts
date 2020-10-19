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
        microsoftTeams.initialize(() => {
            microsoftTeams.appInitialization.notifySuccess();
            setIsInitializeLoading(false);
            onSuccess?.();
        });
    }, []);
    return { isInitializeLoading };
};
