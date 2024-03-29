import React, { FunctionComponent, useEffect } from "react";
import { useRouter } from "next/router";
import { app, authentication } from "@microsoft/teams-js";
import { Loader } from "@fluentui/react-northstar";

export const ZeplinAuthEndContainer: FunctionComponent = () => {
    const {
        query: {
            code,
            error
        }
    } = useRouter();

    useEffect(() => {
        app.initialize().then(() => {
            if (error) {
                authentication.notifyFailure(String(error));
                return;
            }

            authentication.notifySuccess(code as string);
        });
    }, []);

    return <Loader styles={{ height: "100vh" }} />;
};
