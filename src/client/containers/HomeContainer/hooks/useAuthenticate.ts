import { Dispatch, useCallback } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

import { Action, ActionType } from "./useHomeReducer";

type VoidFunction = () => void

export const useAuthenticate = (dispatch: Dispatch<Action>): VoidFunction => useCallback(
    () => {
        microsoftTeams.authentication.authenticate({
            height: 476,
            successCallback: accessToken => {
                dispatch({ type: ActionType.LOGIN_COMPLETE, value: accessToken });
            },
            url: "/api/auth/authorize"
        });
    },
    [dispatch]
);
