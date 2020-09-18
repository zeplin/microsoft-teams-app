import { useQuery } from "react-query";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status-codes";

import { requester } from "../../../lib";
import { Configuration } from "../../../constants";
import { ClientError } from "../../../ClientError";

const RETRY_COUNT = 3;

interface UseConfigurationResult {
    isConfigurationError: boolean;
    refetchConfiguration: () => void;
    configurationError?: string;
}

interface UseConfigurationParams {
    enabled: boolean;
    configurationId: string;
    onSuccess: (configuration: Configuration) => void;
    onError: (isAuthorizationError: boolean) => void;
}

const errorToText = (error: Error): string | undefined => {
    const defaultMessage = "We're experiencing an issue here. Please try it later or let us know: support@zeplin.io.";

    if (!(error instanceof ClientError) || error.status >= INTERNAL_SERVER_ERROR) {
        return defaultMessage;
    }

    switch (error.message) {
        case "User is not a member of the project":
            return "Only project members can update integrations settings";
        case "User is not a member of the styleguide":
            return "Only styleguide members can update integrations settings";
        case "Project webhook not found":
        case "Styleguide webhook not found":
            return "This integration has been removed in Zeplin. You can remove this connector and create it again";
        case "Project not found":
        case "Project is archived":
            return "Project is not available anymore. You can remove this integration";
        case "Styleguide not found":
        case "Styleguide is archived":
            return "Styleguide is not available anymore. You can remove this integration";
        case "Only organization editor (or higher) can access project webhooks":
        case "Only organization editor (or higher) can access styleguide webhooks":
            return "Only organization editor (or higher) can update integration settings";
        case "Only owner of the project can access webhooks":
            return "Only owner of the project update integration settings";
        case "Only owner of the styleguide can access webhooks":
            return "Only owner of the styleguide update integration settings";
        default:
            return defaultMessage;
    }
};

export const useConfiguration = ({
    enabled,
    configurationId,
    onSuccess,
    onError
}: UseConfigurationParams): UseConfigurationResult => {
    const {
        isError: isConfigurationError,
        refetch: refetchConfiguration,
        error: configurationError
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
        refetchConfiguration,
        configurationError: configurationError ? errorToText(configurationError) : undefined
    };
};
