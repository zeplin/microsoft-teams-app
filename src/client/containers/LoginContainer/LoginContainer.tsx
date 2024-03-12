import React, { FunctionComponent } from "react";

import { useInitialize } from "../../hooks";
import { useLogin } from "./hooks";
import { Login } from "./components";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";
import { url, requester, storage } from "../../lib";
import * as microsoftTeams from "@microsoft/teams-js";

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
        onSuccess: async (code?: string) => {
            try {
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
    });

    if (isInitializeLoading) {
        return <Loader styles={{ height: "100vh" }} />;
    }

    microsoftTeams.settings.getSettings(settings => {
        console.log("Settings", JSON.stringify(settings, null, 4));
    });

    // This works - sets content url as specified
    microsoftTeams.settings.setSettings({
        contentUrl: decodeURI(`${window.location.origin}${url.getHomeUrl({
            channel: "MyRandomChannel",
            theme: "{theme}"
        })}`)
    });
    return <Login onButtonClick={login} error={loginError} />;
};
