import { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

import { resourceBasedEvents } from "../../../requester";
import { State, Status } from "./useHomeReducer";
import { useRouter } from "next/router";

function areDifferent<T>(left: T[], right: T[]): boolean {
    return left.length !== right.length || left.some(value => !right.includes(value));
}

function isValidStateForCreate(state: State): boolean {
    return state.status === Status.CONFIGURATION &&
        Boolean(state.accessToken) &&
        Boolean(state.selectedWorkspace) &&
        Boolean(state.selectedResource) &&
        state.selectedWebhookEvents.filter(
            event => resourceBasedEvents[state.selectedResource.type].includes(event)
        ).length > 0;
}

function isValidStateForUpdate(state: State): boolean {
    if (state.status !== Status.CONFIGURATION || !state.accessToken || !state.selectedResource) {
        return false;
    }
    const currentEvents = state.selectedWebhookEvents.filter(
        event => resourceBasedEvents[state.selectedResource.type].includes(event)
    );
    const initialEvents = state.initialSelectedWebhookEvents.filter(
        event => resourceBasedEvents[state.selectedResource.type].includes(event)
    );
    return currentEvents.length > 0 && areDifferent(currentEvents, initialEvents);
}

export const useValidate = (state: State): void => {
    const { query: { id } } = useRouter();
    const isValid = id ? isValidStateForUpdate(state) : isValidStateForCreate(state);

    useEffect(() => {
        if (state.status !== Status.LOADING) {
            microsoftTeams.settings.setValidityState(isValid);
        }
    }, [state.status, isValid]);
};
