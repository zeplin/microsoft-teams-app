import React, { FunctionComponent, useState } from "react";

import { useInitialize } from "../../hooks";
import { authentication } from "@microsoft/teams-js";
import { Login } from "./components";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";
import { url, requester, storage } from "../../lib";

const errorToText = (error?: string): string => {
    switch (error) {
        case "CancelledByUser":
        case "access_denied":
            return "You need to authorize Microsoft Teams app to connect your Zeplin projects and styleguides.";
        default:
            return "Authorization failed due to an API related connectivity issue. Please retry logging in.";
    }
};

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
    const [loginError, setLoginError] = useState<string | undefined>();

    async function authenticate() {
        try {
            const code = await authentication.authenticate({
                height: 476,
                url: "/api/auth/authorize"
            });
            return code;
        } catch (err) {
            setLoginError(errorToText((err as unknown as Error).message));
        }
    }

    async function login() {
        try {
            const code = await authenticate();
            if (!code) {
                throw Error("Authentication code is missing");
            }
            const { accessToken, refreshToken } = await requester.createAuthToken(String(code));
            storage.setAccessToken(accessToken);
            storage.setRefreshToken(refreshToken);

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
        } catch (err) {
            // TODO: log to sentry
        }
    }

    if (isInitializeLoading) {
        return <Loader styles={{ height: "100vh" }} />;
    }
    return <Login onButtonClick={login} error={loginError} />;
};
