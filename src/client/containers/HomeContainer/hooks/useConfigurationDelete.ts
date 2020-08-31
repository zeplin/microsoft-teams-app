import { useEffect } from "react";
import { useMutation } from "react-query";
import * as microsoftTeams from "@microsoft/teams-js";

import { fetchConfigurationDelete } from "../../../lib/requester";
import { State } from "./useHomeReducer";

export const useConfigurationDelete = (state: State): void => {
    const [deleteConfiguration] = useMutation(fetchConfigurationDelete, { throwOnError: true });

    useEffect(() => {
        if (state.configurationId) {
            microsoftTeams.settings.registerOnRemoveHandler(async removeEvent => {
                try {
                    await deleteConfiguration(state.configurationId);
                    removeEvent.notifySuccess();
                } catch (error) {
                    removeEvent.notifyFailure(error?.message ?? error);
                }
            });
        }
    }, []);
};
