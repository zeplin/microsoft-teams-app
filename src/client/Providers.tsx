import React, { FunctionComponent } from "react";
import {
    Provider,
    teamsDarkTheme,
    teamsHighContrastTheme,
    teamsTheme,
    ThemePrepared
} from "@fluentui/react-northstar";

const getTheme = (key?: string): ThemePrepared => {
    switch (key) {
        case "dark":
            return teamsDarkTheme;
        case "contrast":
            return teamsHighContrastTheme;
        default:
            return teamsTheme;
    }
};

interface ProvidersProps {
    theme?: string;
}

export const Providers: FunctionComponent<ProvidersProps> = ({ children, theme }) => (
    <Provider theme={getTheme(theme)}>
        {children}
    </Provider>
);
