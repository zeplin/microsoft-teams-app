import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { Login } from "./Login";
import { Providers } from "../../../../Providers";

describe("Login", () => {
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
