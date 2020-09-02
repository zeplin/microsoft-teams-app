import { useQuery } from "react-query";

import { requester } from "../../../lib";
import { Configuration } from "../../../constants";

interface UseConfigurationParams {
    enabled: boolean;
    configurationId: string;
    onSuccess: (configuration: Configuration) => void;
}

export const useConfiguration = ({
    enabled,
    configurationId,
    onSuccess
}: UseConfigurationParams): void => {
    useQuery(
        ["configuration", configurationId],
        (): Promise<Configuration> => requester.getConfiguration(configurationId),
        {
            enabled,
            cacheTime: Infinity,
            refetchOnWindowFocus: false,
            onSuccess
        }
    );
};
