import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { Providers } from "../../../../Providers";
import { Login } from "./Login";

describe("Login", () => {
    it("should render correctly", () => {
        const { container: { firstChild: component } } = render(
            <Providers>
                <Login onButtonClick={(): void => undefined}/>
            </Providers>
        );

        expect(component).toMatchSnapshot();
    });

    it("should trigger onClick when button is clicked", () => {
        const handler = jest.fn();

        const { getByText } = render(
            <Providers>
                <Login onButtonClick={handler}/>
            </Providers>
        );

        fireEvent.click(getByText("Log in Zeplin"));

        expect(handler).toBeCalledWith();
    });
});
