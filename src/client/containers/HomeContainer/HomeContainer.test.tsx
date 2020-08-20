import React from "react";
import { HomeContainer } from "./HomeContainer";
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
            <HomeContainer />
        </Providers>
    );
}

describe("HomeContainer", () => {
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
        const spy = jest.spyOn(microsoftTeams.authentication, "authenticate");

        const { container: { firstChild: component }, getByText } = renderHome();

        expect(spy).not.toBeCalled();

        fireEvent.click(getByText("Log in Zeplin"));

        expect(component).toMatchSnapshot();
        expect(spy).toBeCalled();
    });
});
