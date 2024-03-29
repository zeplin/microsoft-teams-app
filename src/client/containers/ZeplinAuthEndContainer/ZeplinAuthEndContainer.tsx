import React, { FunctionComponent, useEffect } from "react";
import { useRouter } from "next/router";
import * as microsoftTeams from "@microsoft/teams-js";
import { Loader } from "@fluentui/react-northstar";

export const ZeplinAuthEndContainer: FunctionComponent = () => {
    const {
        query: {
            code,
            error
        }
    } = useRouter();

    useEffect(() => {
        // TODO: Convert callback to promise, for more info, please refer to https://aka.ms/teamsfx-callback-to-promise.
        microsoftTeams.app.initialize(() => {
            if (error) {
                microsoftTeams.authentication.notifyFailure(String(error));
                return;
            }

            microsoftTeams.authentication.notifySuccess(code as string);
        });
    }, []);

    return <Loader styles={{ height: "100vh" }} />;
};
