import { useEffect, useRef } from "react";
import { useMutation } from "react-query";
import * as microsoftTeams from "@microsoft/teams-js";

import { fetchConfigurationDelete } from "../../../requester";
import { State } from "./useHomeReducer";

export const useConfigurationDelete = (state: State): void => {
    /**
     * Workaround: microsoftTeams.settings.registerOnRemoveHandler produce error when it's called multiple times.
     * As workaround microsoftTeams.settings.registerOnRemoveHandler called once and get the value of accessToken via useRef
     * For more info: https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
     */
    const accessTokenRef = useRef(state.accessToken);

    useEffect(() => {
        accessTokenRef.current = state.accessToken;
    }, [state.accessToken]);

    const [deleteConfiguration] = useMutation(fetchConfigurationDelete, { throwOnError: true });

    useEffect(() => {
        if (state.configurationId) {
            microsoftTeams.settings.registerOnRemoveHandler(async removeEvent => {
                if (accessTokenRef.current) {
                    try {
                        await deleteConfiguration({
                            accessToken: accessTokenRef.current,
                            configurationId: state.configurationId
                        });
                        removeEvent.notifySuccess();
                    } catch (error) {
                        removeEvent.notifyFailure(error?.message ?? error);
                    }
                } else {
                    removeEvent.notifyFailure("access token required");
                }
            });
        }
    }, []);
};
