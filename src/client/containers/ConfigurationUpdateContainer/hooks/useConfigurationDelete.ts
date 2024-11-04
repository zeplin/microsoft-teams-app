import { useEffect } from "react";
import { useMutation } from "react-query";
import { pages } from "@microsoft/teams-js";

import { requester } from "../../../lib";

interface UseConfigurationDeleteParams {
    configurationId: string;
    isInitialized: boolean;
}

export const useConfigurationDelete = ({ configurationId, isInitialized }: UseConfigurationDeleteParams): void => {
    const [deleteConfiguration] = useMutation(requester.deleteConfiguration, { throwOnError: true });

    useEffect(() => {
        if (isInitialized) {
            pages.config.registerOnRemoveHandler(async removeEvent => {
                try {
                    await deleteConfiguration(configurationId);
                    removeEvent.notifySuccess();
                } catch (error) {
                    removeEvent.notifyFailure((error as Error)?.message ?? `Unknown error ${error}`);
                }
            });
        }
    }, [isInitialized]);
};
