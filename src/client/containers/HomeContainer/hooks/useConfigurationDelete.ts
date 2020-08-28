import { useEffect } from "react";
import { useMutation } from "react-query";
import * as microsoftTeams from "@microsoft/teams-js";

import { fetchConfigurationDelete } from "../../../requester";
import { State } from "./useHomeReducer";

export const useConfigurationDelete = (state: State): void => {
    const [deleteConfiguration] = useMutation(fetchConfigurationDelete, { throwOnError: true });

    useEffect(() => {
        if (state.configurationId) {
            microsoftTeams.getContext(() => {
                microsoftTeams.settings.registerOnRemoveHandler(async removeEvent => {
                    if (state.accessToken) {
                        try {
                            await deleteConfiguration({
                                accessToken: state.accessToken,
                                configurationId: state.configurationId
                            });
                            removeEvent.notifySuccess();
                        } catch (error) {
                            removeEvent.notifyFailure(error?.message ?? error);
                        }
                    } else {
                        removeEvent.notifyFailure("access token not found");
                    }
                });
            });
        }
    }, [state.configurationId, state.accessToken]);
};
