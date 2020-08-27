import { Dispatch, useEffect } from "react";
import { useMutation } from "react-query";

import { fetchConfiguration } from "../../../requester";
import { Action, ActionType, State } from "./useHomeReducer";

export const useStateUpdateFromConfiguration = (
    state: State,
    dispatch: Dispatch<Action>
): void => {
    const [update] = useMutation(
        fetchConfiguration,
        {
            onSuccess: value => dispatch({ type: ActionType.SET_FROM_CONFIGURATION, value })
        }
    );

    useEffect(() => {
        if (state.configurationId && state.accessToken) {
            update({
                accessToken: state.accessToken,
                configurationId: String(state.configurationId)
            });
        }
    }, [state.accessToken]);
};
