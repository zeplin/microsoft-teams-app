import { Dispatch, Reducer, useReducer } from "react";

import { Configuration, Resource, WebhookEventType } from "../../../requester";
import { useRouter } from "next/router";

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
    type: ActionType.SET_TOKEN | ActionType.SET_SELECTED_WORKSPACE;
    value: string;
} | {
    type: ActionType.SET_SELECTED_RESOURCE;
    value: Resource | undefined;
} | {
    type: ActionType.TOGGLE_SELECTED_WEBHOOK_EVENT;
    value: WebhookEventType;
} | {
    type: ActionType.SET_FROM_CONFIGURATION;
    value: Configuration;
}

export interface State {
    configurationId?: string;
    status: Status;
    accessToken?: string;
    selectedWorkspace?: string;
    selectedResource?: Resource;
    selectedWebhookEvents: WebhookEventType[];
    initialSelectedWebhookEvents: WebhookEventType[];
}

export enum Status {
    LOADING,
    LOGIN,
    LOADING_CONFIGURATION,
    CONFIGURATION
}

export enum ActionType {
    COMPLETE_LOADING,
    SET_TOKEN,
    SET_FROM_CONFIGURATION,
    SET_SELECTED_WORKSPACE,
    SET_SELECTED_RESOURCE,
    TOGGLE_SELECTED_WEBHOOK_EVENT
}

export const initialState: State = {
    configurationId: undefined,
    status: Status.LOADING,
    accessToken: undefined,
    selectedWorkspace: undefined,
    selectedResource: undefined,
    selectedWebhookEvents: Object.values(WebhookEventType),
    initialSelectedWebhookEvents: Object.values(WebhookEventType)
};

export const homeReducer: Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case ActionType.COMPLETE_LOADING:
            return {
                ...state,
                status: Status.LOGIN,
                accessToken: undefined
            };
        case ActionType.SET_TOKEN:
            return {
                ...state,
                status: state.configurationId ? Status.LOADING_CONFIGURATION : Status.CONFIGURATION,
                accessToken: action.value
            };
        case ActionType.SET_FROM_CONFIGURATION:
            return {
                ...state,
                status: Status.CONFIGURATION,
                selectedWebhookEvents: action.value.webhook.events,
                initialSelectedWebhookEvents: action.value.webhook.events,
                selectedResource: action.value.resource
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

export const useHomeReducer = (): [State, Dispatch<Action>] => {
    const {
        query: {
            id
        }
    } = useRouter();

    return useReducer(
        homeReducer,
        {
            ...initialState,
            configurationId: id ? String(id) : undefined
        }
    );
};
