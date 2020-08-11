import React, {
    FunctionComponent, Reducer, useEffect, useReducer
} from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { Loader } from "@fluentui/react-northstar";
import { Login } from "./components";

enum Status {
    LOADING,
    LOGIN,
    CONFIGURATION
}

enum ActionType {
    COMPLETE_LOADING,
    GET_TOKEN
}

type State = {
    status: Status.LOADING | Status.LOGIN;
} | {
    status: Status.CONFIGURATION;
    accessToken: string;
}

type Action = {
    type: ActionType.COMPLETE_LOADING;
} | {
    type: ActionType.GET_TOKEN;
    value: string;
}

const reducer: Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case ActionType.COMPLETE_LOADING:
            return { status: Status.LOGIN };
        case ActionType.GET_TOKEN:
            return { status: Status.CONFIGURATION, accessToken: action.value };
        default:
            throw new Error();
    }
};

export const Home: FunctionComponent = () => {
    const [state, dispatch] = useReducer(reducer, { status: Status.LOADING });

    useEffect(() => {
        microsoftTeams.initialize(() => {
            microsoftTeams.appInitialization.notifySuccess();
            dispatch({ type: ActionType.COMPLETE_LOADING });
        });
    }, []);

    switch (state.status) {
        case Status.LOADING:
            return <Loader id="loader-home"/>;
        case Status.LOGIN:
            return <Login onTokenReceive={(value): void => dispatch({ type: ActionType.GET_TOKEN, value })} />;
        case Status.CONFIGURATION:
            return (
                <div>
                    {state.accessToken}
                </div>
            );
        default:
            throw new Error();
    }
};
