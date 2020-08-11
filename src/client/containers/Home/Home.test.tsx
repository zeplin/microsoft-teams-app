import React from "react";
import { Home } from "./Home";
import * as microsoftTeams from "@microsoft/teams-js";
import { fireEvent, render, RenderResult } from "@testing-library/react";
import { Providers } from "../../components";

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
    authentication: {
        authenticate: jest.fn(({ successCallback }) => successCallback("accessToken"))
    }
}));

jest.mock("../../config", () => ({
    BASE_URL: "https://test.com"
}));

function renderHome(): RenderResult {
    return render(
        <Providers>
            <Home />
        </Providers>
    );
}

describe("Home", () => {
    it("should render initially", () => {
        const spy = jest.spyOn(microsoftTeams, "initialize")
            .mockImplementation(() => undefined);
        const { container: { firstChild: component } } = renderHome();
        expect(component).toMatchSnapshot();
        spy.mockImplementation(callback => callback());
    });

    it("should initialize Microsoft Teams", () => {
        const spy = jest.spyOn(microsoftTeams.appInitialization, "notifySuccess");

        const { container: { firstChild: component } } = renderHome();

        expect(component).toMatchSnapshot();
        expect(spy).toBeCalledWith();
    });

    it("should change ui when login flow completed", () => {
        const spy = jest.spyOn(microsoftTeams.appInitialization, "notifySuccess");

        const { container: { firstChild: component }, getByText } = renderHome();

        fireEvent.click(getByText("Log in Zeplin"));

        expect(component).toMatchSnapshot();
        expect(spy).toBeCalledWith();
    });
});
