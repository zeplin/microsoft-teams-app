import React from "react";
import { ConfigurationContainer } from "./ConfigurationContainer";
import * as microsoftTeams from "@microsoft/teams-js";
import { fireEvent, render, RenderResult } from "@testing-library/react";
import { Providers } from "../../Providers";

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

function renderHome(): RenderResult {
    return render(
        <Providers>
            <ConfigurationContainer />
        </Providers>
    );
}

describe("HomeContainer", () => {
    it("should initialize Microsoft Teams", () => {
        const spy = jest.spyOn(microsoftTeams.appInitialization, "notifySuccess");

        renderHome();

        expect(spy).toBeCalledWith();
    });

    it("should change ui when login flow completed", () => {
        const spy = jest.spyOn(microsoftTeams.authentication, "authenticate");

        const { getByText } = renderHome();

        expect(spy).not.toBeCalled();

        fireEvent.click(getByText("Log in Zeplin"));

        expect(spy).toBeCalled();
    });
});
