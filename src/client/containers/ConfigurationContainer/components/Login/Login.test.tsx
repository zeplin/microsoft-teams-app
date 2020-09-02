import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { TestProviders } from "../../../../test/TestProviders";
import { Login } from "./Login";

describe("Login", () => {
    it("should render correctly", () => {
        const { container: { firstChild: component } } = render(
            <TestProviders>
                <Login onButtonClick={(): void => undefined}/>
            </TestProviders>
        );

        expect(component).toMatchSnapshot();
    });

    it("should trigger onClick when button is clicked", () => {
        const handler = jest.fn();

        const { getByText } = render(
            <TestProviders>
                <Login onButtonClick={handler}/>
            </TestProviders>
        );

        fireEvent.click(getByText("Log in Zeplin"));

        expect(handler).toBeCalledWith();
    });

    it("should render error row when an error is specified", () => {
        const handler = jest.fn();

        const { container: { firstChild: component } } = render(
            <TestProviders>
                <Login onButtonClick={handler} error="Some error" />
            </TestProviders>
        );

        expect(component).toMatchSnapshot();
    });
});
