import { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

import { resourceBasedEvents } from "../../../requester";
import { State, Status } from "./useHomeReducer";

function isValidState(state: State): boolean {
    return state.status === Status.CONFIGURATION &&
        Boolean(state.accessToken) &&
        Boolean(state.selectedWorkspace) &&
        Boolean(state.selectedResource) &&
        state.selectedWebhookEvents.filter(
            event => resourceBasedEvents[state.selectedResource.type].includes(event)
        ).length > 0;
}

export const useValidate = (state: State): void => {
    const isValid = isValidState(state);

    useEffect(() => {
        if (state.status !== Status.LOADING) {
            microsoftTeams.settings.setValidityState(isValid);
        }
    }, [state.status, isValid]);
};
