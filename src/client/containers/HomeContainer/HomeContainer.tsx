import React, { FunctionComponent, useEffect } from "react";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";

import { storage, url } from "../../lib";

export const HomeContainer: FunctionComponent = () => {
    const routerParam = useRouter();
    console.log("HomeContainer - routerParam:", JSON.stringify(routerParam, null, 4));
    let {
        query: {
            channel,
            id,
            resourceName,
            resourceType,
            theme
        },
        replace
    } = routerParam;
    // console.log("HOME - window:", JSON.stringify(window.location, null, 4));

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

        // id = id ? id : "65f0182c23b31fe60f2bd1bb";
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
        console.log("HomeContainer -- Mount");
        // Workaround: Microsoft Teams initialize two iframes
        // One with real one and one with template url
        // TODO: Find a robust solution to disable second iframe
        if (channel && channel !== "{channelName}") {
            replace(getUrl());
        }
    }, []);

    return <Loader styles={{ height: "100vh" }} />;
};
