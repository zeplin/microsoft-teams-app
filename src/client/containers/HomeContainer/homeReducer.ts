import { Reducer } from "react";

import { Resource } from "../../requester";

type State = {
    status: Status.LOADING | Status.LOGIN;
} | {
    status: Status.CONFIGURATION;
    accessToken: string;
    selectedWorkspace: undefined;
    selectedResource: undefined;
} | {
    status: Status.CONFIGURATION;
    accessToken: string;
    selectedWorkspace: string;
    selectedResource: Resource | undefined;
}

type Action = {
    type: ActionType.COMPLETE_LOADING;
} | {
    type: ActionType.GET_TOKEN | ActionType.SET_SELECTED_WORKSPACE;
    value: string;
} | {
    type: ActionType.SET_SELECTED_RESOURCE;
    value: Resource | undefined;
}

export enum Status {
    LOADING,
    LOGIN,
    CONFIGURATION
}

export enum ActionType {
    COMPLETE_LOADING,
    GET_TOKEN,
    SET_SELECTED_WORKSPACE,
    SET_SELECTED_RESOURCE
}

export const homeReducer: Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case ActionType.COMPLETE_LOADING:
            return { status: Status.LOGIN };
        case ActionType.GET_TOKEN:
            return {
                status: Status.CONFIGURATION,
                accessToken: action.value,
                selectedWorkspace: undefined,
                selectedResource: undefined
            };
        case ActionType.SET_SELECTED_WORKSPACE:
            return {
                ...state,
                selectedWorkspace: action.value,
                selectedResource: undefined
            };
        case ActionType.SET_SELECTED_RESOURCE:
            return {
                ...state,
                selectedResource: action.value
            };
        default:
            throw new Error();
    }
};
