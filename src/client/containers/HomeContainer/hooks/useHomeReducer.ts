import { Dispatch, Reducer, useReducer } from "react";

import { Resource, WebhookEventType } from "../../../requester";

const toggleWebhookEvent = (
    webhookEvents: WebhookEventType[],
    webhookEvent: WebhookEventType
): WebhookEventType[] => {
    const index = webhookEvents.indexOf(webhookEvent);
    if (index === -1) {
        return [...webhookEvents, webhookEvent];
    }
    return [...webhookEvents.slice(0, index), ...webhookEvents.slice(index + 1)];
};

export type Action = {
    type: ActionType.COMPLETE_LOADING;
} | {
    type: ActionType.GET_TOKEN | ActionType.SET_SELECTED_WORKSPACE;
    value: string;
} | {
    type: ActionType.SET_SELECTED_RESOURCE;
    value: ResourceWithName | undefined;
}| {
    type: ActionType.TOGGLE_SELECTED_WEBHOOK_EVENT;
    value: WebhookEventType;
}

export interface ResourceWithName extends Resource{
    name: string;
}

export interface State {
    status: Status;
    accessToken?: string;
    selectedWorkspace?: string;
    selectedResource?: ResourceWithName;
    selectedWebhookEvents: WebhookEventType[];
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
    SET_SELECTED_RESOURCE,
    TOGGLE_SELECTED_WEBHOOK_EVENT
}

export const initialState = {
    status: Status.LOADING,
    accessToken: undefined,
    selectedWorkspace: undefined,
    selectedResource: undefined,
    isValid: false,
    selectedWebhookEvents: Object.values(WebhookEventType)
};

export const homeReducer: Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case ActionType.COMPLETE_LOADING:
            return {
                ...state,
                status: Status.LOGIN,
                accessToken: undefined
            };
        case ActionType.GET_TOKEN:
            return {
                ...state,
                status: Status.CONFIGURATION,
                accessToken: action.value
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
        case ActionType.TOGGLE_SELECTED_WEBHOOK_EVENT:
            return {
                ...state,
                selectedWebhookEvents: toggleWebhookEvent(state.selectedWebhookEvents, action.value)
            };
        default:
            throw new Error();
    }
};

export const useHomeReducer = (): [State, Dispatch<Action>] => useReducer(homeReducer, initialState);
