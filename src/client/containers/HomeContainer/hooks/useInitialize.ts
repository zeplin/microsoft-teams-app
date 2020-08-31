import { Dispatch, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

import { Action, ActionType } from "./useHomeReducer";

export const useInitialize = (dispatch: Dispatch<Action>): void => {
    useEffect(() => {
        microsoftTeams.initialize(() => {
            microsoftTeams.appInitialization.notifySuccess();
            dispatch({ type: ActionType.COMPLETE_LOADING });
        });
    }, []);
};
