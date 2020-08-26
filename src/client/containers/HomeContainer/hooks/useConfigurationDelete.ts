import { useEffect, useRef } from "react";
import { useMutation } from "react-query";
import * as microsoftTeams from "@microsoft/teams-js";

import { fetchConfigurationDelete } from "../../../requester";
import { State } from "./useHomeReducer";
import { useRouter } from "next/router";

export const useConfigurationDelete = (state: State): void => {
    const {
        query: {
            id
        }
    } = useRouter();

    /**
     * Workaround: microsoftTeams.settings.registerOnRemoveHandler produce error when it's called multiple times.
     * As workaround the function is called once and gets the value of accessToken via useRef
     * For more info: https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
     */
    const accessTokenRef = useRef(state.accessToken);

    useEffect(() => {
        accessTokenRef.current = state.accessToken;
    }, [state.accessToken]);

    const [deleteConfiguration] = useMutation(fetchConfigurationDelete, { throwOnError: true });

    useEffect(() => {
        microsoftTeams.settings.registerOnRemoveHandler(removeEvent => {
            if (!accessTokenRef.current) {
                removeEvent.notifyFailure("access token not found");
            } else {
                try {
                    deleteConfiguration({
                        accessToken: accessTokenRef.current,
                        configurationId: String(id)
                    }).then(() => {
                        removeEvent.notifySuccess();
                    }).catch(error => {
                        removeEvent.notifyFailure(error?.message ?? error);
                    });
                } catch (error) {
                    removeEvent.notifyFailure(error?.message ?? error);
                }
            }
        });
    }, []);
};
