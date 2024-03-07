import { useEffect, useState } from "react";
import { app } from "@microsoft/teams-js";

interface UseInitializeParams {
    onSuccess?: () => void;
}

interface UseInitializeResult {
    isInitializeLoading: boolean;
}

export const useInitialize = ({ onSuccess }: UseInitializeParams = {}): UseInitializeResult => {
    const [isInitializeLoading, setIsInitializeLoading] = useState(true);
    useEffect(() => {
        app.initialize().then(() => {
            app.notifySuccess();
            setIsInitializeLoading(false);
            onSuccess?.();
        });
    }, []);
    return { isInitializeLoading };
};
