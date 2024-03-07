import React, { FunctionComponent } from "react";

import { useInitialize } from "../../hooks";
import { authentication } from "@microsoft/teams-js";
import { Login } from "./components";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";
import { url, requester, storage } from "../../lib";

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
    // Const [login, { loginError }] = useLogin({
    //     OnSuccess:
    // });

    async function login() {
        try {
            const code = await authentication.authenticate({
                height: 476,
                url: "/api/auth/authorize"
            });
            const { accessToken, refreshToken } = await requester.createAuthToken(String(code));
            storage.setAccessToken(accessToken);
            storage.setRefreshToken(refreshToken);
        } catch (err) {
            // TODO: log to sentry
        }
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
    let loginError;
    if (isInitializeLoading) {
        return <Loader styles={{ height: "100vh" }} />;
    }
    return <Login onButtonClick={login} error={loginError} />;
};
