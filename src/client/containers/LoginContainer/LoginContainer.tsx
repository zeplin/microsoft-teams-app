import React, { FunctionComponent } from "react";

import { useInitialize } from "../../hooks";
import { useLogin } from "./hooks";
import { Login } from "./components";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";
import { url } from "../../lib";

export const LoginContainer: FunctionComponent = () => {
    const {
        query: {
            channel,
            id,
            resourceName,
            resourceType,
            theme
        },
        replace
    } = useRouter();

    const { isInitializeLoading } = useInitialize();
    const [login, { loginError }] = useLogin({
        onSuccess: () => {
            replace(id
                ? url.getConfigurationUpdateUrl({
                    channel: channel as string,
                    id: id as string,
                    resourceName: resourceName as string,
                    resourceType: resourceType as string,
                    theme: theme as string
                })
                : url.getConfigurationCreateUrl({

                    channel: channel as string,
                    theme: theme as string
                }));
        }
    });

    if (isInitializeLoading) {
        return <Loader styles={{ height: "100vh" }} />;
    }
    return <Login onButtonClick={login} error={loginError} />;
};
