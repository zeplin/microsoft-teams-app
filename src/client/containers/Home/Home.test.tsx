import React from "react";
import { Home } from "./Home";
import * as microsoftTeams from "@microsoft/teams-js";
import { fireEvent, render } from "@testing-library/react";

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
    }
}));

jest.mock("../../config", () => ({
    BASE_URL: "https://test.com"
}));

describe("Home", () => {
    it("should render initially", () => {
        const spy = jest.spyOn(microsoftTeams, "initialize")
            .mockImplementation(() => undefined);
        const { container: { firstChild: component } } = render(<Home />);
        expect(component).toMatchSnapshot();
        spy.mockImplementation(callback => callback());
    });

    it("should initialize Microsoft Teams", () => {
        const spy = jest.spyOn(microsoftTeams.appInitialization, "notifySuccess");

        const { container: { firstChild: component } } = render(<Home />);
        expect(component).toMatchSnapshot();
        expect(spy).toBeCalledWith();
    });

    it("should set the validity state on input change", () => {
        const spy = jest.spyOn(microsoftTeams.settings, "setValidityState");
        const { container } = render(<Home />);

        const input = container.querySelector("input");

        expect(input.value).toBe("");
        fireEvent.change(input, { target: { value: "Good Day" } });
        expect(input.value).toBe("Good Day");
        expect(spy).toBeCalledWith(true);
    });

    it("should remove successfully", () => {
        const event = {
            notifySuccess: jest.fn(),
            notifyFailure: jest.fn()
        };
        const spy = jest.spyOn(microsoftTeams.settings, "registerOnRemoveHandler")
            .mockImplementation(callback => callback(event));

        render(<Home />);

        expect(event.notifySuccess).toBeCalledWith();
        expect(event.notifyFailure).not.toBeCalled();
        spy.mockImplementation();
    });

    it("should save successfully", () => {
        const event = {
            notifySuccess: jest.fn(),
            notifyFailure: jest.fn()
        };
        let saveCallback;
        const spySaveHandler = jest.spyOn(microsoftTeams.settings, "registerOnSaveHandler")
            .mockImplementation(callback => {
                saveCallback = callback;
            });
        const spySetSettings = jest.spyOn(microsoftTeams.settings, "setSettings");

        const { container } = render(<Home />);
        const input = container.querySelector("input");

        fireEvent.change(input, { target: { value: "Good Day" } });
        expect(input.value).toBe("Good Day");
        saveCallback(event);

        expect(event.notifySuccess).toBeCalledWith();
        expect(event.notifyFailure).not.toBeCalled();
        expect(spySetSettings).toBeCalledWith({
            configName: "Good Day",
            contentUrl: "https://test.com/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
            entityId: "Good Day"
        });

        spySaveHandler.mockImplementation();
    });
});
