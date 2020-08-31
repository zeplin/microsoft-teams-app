import { Dispatch } from "react";
import { useQuery } from "react-query";

import { Configuration, fetchConfiguration } from "../../../requester";
import { Action, ActionType, State } from "./useHomeReducer";

export const useStateUpdateFromConfiguration = (
    state: State,
    dispatch: Dispatch<Action>
): void => {
    useQuery(
        ["configuration", String(state.configurationId), state.accessToken],
        (key, configurationId, accessToken): Promise<Configuration> => fetchConfiguration({
            accessToken,
            configurationId
        }),
        {
            enabled: state.accessToken && state.configurationId,
            cacheTime: Infinity,
            refetchOnWindowFocus: false,
            onSuccess: (value: Configuration): void => dispatch({ type: ActionType.SET_FROM_CONFIGURATION, value })
        }
    );
};
