import React, { FunctionComponent } from "react";
import { Provider } from "@fluentui/react-northstar";

export const TestProviders: FunctionComponent = ({ children }) => (
    <Provider>
        {children}
    </Provider>
);
