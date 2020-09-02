import React from "react";
import { ConfigurationContainer } from "./ConfigurationContainer";
import * as microsoftTeams from "@microsoft/teams-js";
import { act, fireEvent, render, RenderResult } from "@testing-library/react";
import { TestProviders } from "../../test/TestProviders";

jest.mock("@microsoft/teams-js", () => ({
    initialize: jest.fn(callback => callback()),
    appInitialization: {
        notifySuccess: jest.fn()
    },
    settings: {
        registerOnSaveHandler: jest.fn(),
        registerOnRemoveHandler: jest.fn(),
        setValidityState: jest.fn(),
        setSettings: jest.fn(),
        getSettings: jest.fn(callback => callback({ entityId: "" }))
    },
    getContext: jest.fn(),
    authentication: {
        authenticate: jest.fn(({ successCallback }) => successCallback("accessToken"))
    }
}));

jest.mock("next/router", () => ({
    useRouter: (): object => ({
        query: {
            channel: "channel"
        }
    })
}));

function renderConfigurationContainer(): RenderResult {
    return render(
        <TestProviders>
            <ConfigurationContainer />
        </TestProviders>
    );
}

describe("ConfigurationContainer", () => {
    it("should initialize Microsoft Teams", () => {
        const spy = jest.spyOn(microsoftTeams.appInitialization, "notifySuccess");

        renderConfigurationContainer();

        expect(spy).toBeCalledWith();
    });

    it("should change ui when login flow completed", () => {
        const spy = jest.spyOn(microsoftTeams.authentication, "authenticate");

        const { getByText } = renderConfigurationContainer();

        expect(spy).not.toBeCalled();

        act(() => {
            fireEvent.click(getByText("Log in Zeplin"));
        });

        expect(spy).toBeCalled();
    });
});
