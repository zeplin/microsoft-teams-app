import { Dispatch, useCallback } from "react";
import { Action, ActionType } from "./useHomeReducer";
import * as microsoftTeams from "@microsoft/teams-js";

type VoidFunction = () => void

export const useAuthenticate = (dispatch: Dispatch<Action>): VoidFunction => useCallback(
    () => {
        microsoftTeams.authentication.authenticate({
            height: 476,
            successCallback: accessToken => {
                dispatch({ type: ActionType.SET_TOKEN, value: accessToken });
            },
            url: "/api/auth/authorize"
        });
    },
    [dispatch]
);
