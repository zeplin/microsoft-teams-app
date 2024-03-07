import React, { FunctionComponent, useEffect } from "react";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";

import { storage, url } from "../../lib";
import { app } from "@microsoft/teams-js";

export const HomeContainer: FunctionComponent = () => {
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

    const getUrl = (): string => {
        if (!storage.getAccessToken()) {
            return url.getLoginUrl(id
                ? {
                    channel: channel as string,
                    id: id as string,
                    resourceName: resourceName as string,
                    resourceType: resourceType as string,
                    theme: theme as string
                }
                : {
                    channel: channel as string,
                    theme: theme as string
                });
        }
        if (id) {
            return url.getConfigurationUpdateUrl({
                channel: channel as string,
                id: id as string,
                resourceName: resourceName as string,
                resourceType: resourceType as string,
                theme: theme as string
            });
        }
        return url.getConfigurationCreateUrl({
            channel: channel as string,
            theme: theme as string
        });
    };

    useEffect(() => {
        console.log("useEffect", channel);

        app.initialize().then(() => {
            app.getContext().then(context => {
                console.log(JSON.stringify(context));
            });
        });
        // Workaround: Microsoft Teams initialize two iframes
        // One with real one and one with template url
        // TODO: Find a robust solution to disable second iframe
        if (channel && channel !== "{channelName}") {
            replace(getUrl());
        }
    }, []);

    return <Loader styles={{ height: "100vh" }} />;
};
