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
        microsoftTeams.initialize(() => {
            if (error) {
                microsoftTeams.authentication.notifyFailure(String(error));
                return;
            }

            try {
                microsoftTeams.authentication.notifySuccess(code as string);
            } catch (tokenError) {
                microsoftTeams.authentication.notifyFailure((tokenError as Error)?.message ?? `Unknown error ${tokenError}`);
            }
        });
    }, []);

    return <Loader styles={{ height: "100vh" }} />;
};
