import { useQuery } from "react-query";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status-codes";

import { requester } from "../../../lib";
import { Configuration } from "../../../constants";
import { ClientError } from "../../../ClientError";
import { errorToText } from "./errorToText";

const RETRY_COUNT = 3;

interface UseConfigurationResult {
    isConfigurationError: boolean;
    isConfigurationErrorPermanent: boolean;
    configurationError?: string;
    isConfigurationLoading: boolean;
    configuration?: Configuration;
    refetchConfiguration: () => void;
}

interface UseConfigurationParams {
    configurationId: string;
    onSuccess: (result: Configuration) => void;
    onError: (isAuthorizationError: boolean) => void;
}

export const useConfiguration = ({
    configurationId,
    onSuccess,
    onError
}: UseConfigurationParams): UseConfigurationResult => {
    const {
        isError: isConfigurationError,
        isLoading: isConfigurationLoading,
        refetch: refetchConfiguration,
        error: configurationError,
        data: configuration
    } = useQuery(
        ["configuration", configurationId],
        (): Promise<Configuration> => requester.getConfiguration(configurationId),
        {
            cacheTime: Infinity,
            refetchOnWindowFocus: false,
            retry: (failureCount, error: Error) => (
                (!(error instanceof ClientError) || error.status >= INTERNAL_SERVER_ERROR) &&
                failureCount <= RETRY_COUNT
            ),
            onSuccess,
            onError: error => onError(error instanceof ClientError && error.status === UNAUTHORIZED)
        }
    );

    return {
        isConfigurationError,
        isConfigurationLoading,
        refetchConfiguration,
        configuration,
        configurationError: configurationError ? errorToText(configurationError) : undefined,
        isConfigurationErrorPermanent: (
            configurationError instanceof ClientError &&
            configurationError.status < INTERNAL_SERVER_ERROR
        )
    };
};
