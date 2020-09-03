import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { TestProviders } from "../../../../test/TestProviders";
import { Login } from "./Login";

describe("Login", () => {
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
});
