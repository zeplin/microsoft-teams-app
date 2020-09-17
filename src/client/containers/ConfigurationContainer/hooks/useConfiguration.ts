import { useQuery } from "react-query";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status-codes";

import { requester } from "../../../lib";
import { Configuration } from "../../../constants";
import { ClientError } from "../../../ClientError";

const RETRY_COUNT = 3;

interface UseConfigurationResult {
    isConfigurationError: boolean;
    refetchConfiguration: () => void;
}

interface UseConfigurationParams {
    enabled: boolean;
    configurationId: string;
    onSuccess: (configuration: Configuration) => void;
    onError: (isAuthorizationError: boolean) => void;
}

export const useConfiguration = ({
    enabled,
    configurationId,
    onSuccess,
    onError
}: UseConfigurationParams): UseConfigurationResult => {
    const {
        isError: isConfigurationError,
        refetch: refetchConfiguration
    } = useQuery(
        ["configuration", configurationId],
        (): Promise<Configuration> => requester.getConfiguration(configurationId),
        {
            enabled,
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
        refetchConfiguration
    };
};
