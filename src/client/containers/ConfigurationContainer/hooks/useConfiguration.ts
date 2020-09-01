import { useQuery } from "react-query";

import { requester } from "../../../lib";
import { ConfigurationConstants } from "../../../constants";

interface UseConfigurationParams {
    enabled: boolean;
    configurationId: string;
    onSuccess: (configuration: ConfigurationConstants) => void;
}

export const useConfiguration = ({
    enabled,
    configurationId,
    onSuccess
}: UseConfigurationParams): void => {
    useQuery(
        ["configuration", configurationId],
        (): Promise<ConfigurationConstants> => requester.getConfiguration(configurationId),
        {
            enabled,
            cacheTime: Infinity,
            refetchOnWindowFocus: false,
            onSuccess
        }
    );
};
