import { useEffect } from "react";
import { useMutation } from "react-query";
import * as microsoftTeams from "@microsoft/teams-js";

import { requester } from "../../../lib";

interface UseConfigurationDeleteParams {
    configurationId: string;
}

export const useConfigurationDelete = ({ configurationId }: UseConfigurationDeleteParams): void => {
    const [deleteConfiguration] = useMutation(requester.deleteConfiguration, { throwOnError: true });

    useEffect(() => {
        if (configurationId) {
            microsoftTeams.settings.registerOnRemoveHandler(async removeEvent => {
                try {
                    await deleteConfiguration(configurationId);
                    removeEvent.notifySuccess();
                } catch (error) {
                    removeEvent.notifyFailure(error?.message ?? error);
                }
            });
        }
    }, []);
};
