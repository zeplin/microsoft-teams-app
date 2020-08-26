import { Dispatch, useEffect } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/router";

import { fetchConfiguration } from "../../../requester";
import { Action, ActionType, State } from "./useHomeReducer";

interface UseStateUpdateFromConfigurationResult {
    isStateUpdateLoading: boolean;
}

export const useStateUpdateFromConfiguration = (
    state: State,
    dispatch: Dispatch<Action>
): UseStateUpdateFromConfigurationResult => {
    const { query: { id } } = useRouter();
    const [update, { isLoading: isStateUpdateLoading }] = useMutation(
        fetchConfiguration,
        {
            onSuccess: value => dispatch({ type: ActionType.SET_FROM_CONFIGURATION, value })
        }
    );

    useEffect(() => {
        if (id && state.accessToken) {
            update({
                accessToken: state.accessToken,
                configurationId: String(id)
            });
        }
    }, [state.accessToken]);
    return { isStateUpdateLoading };
};
