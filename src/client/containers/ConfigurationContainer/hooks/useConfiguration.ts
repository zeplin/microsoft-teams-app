import { useQuery } from "react-query";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status-codes";
import { AxiosError } from "axios";

import { requester } from "../../../lib";
import { Configuration } from "../../../constants";

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
            retry: (failureCount, error: AxiosError) => (
                (error.response?.status === undefined || error.response?.status >= INTERNAL_SERVER_ERROR) &&
                failureCount <= RETRY_COUNT
            ),
            onSuccess,
            onError: error => onError(error.response?.status === UNAUTHORIZED)
        }
    );

    return {
        isConfigurationError,
        refetchConfiguration
    };
};
