import React, { FunctionComponent, useEffect } from "react";
import { Loader } from "@fluentui/react-northstar";
import { useRouter } from "next/router";

import { storage, url } from "../../lib";

export const HomeContainer: FunctionComponent = () => {
    const { query: { channel, id }, replace } = useRouter();

    const getUrl = (): string => {
        if (!storage.getAccessToken()) {
            return url.login;
        }
        if (id) {
            return url.configurationUpdate;
        }
        return url.configurationCreate;
    };

    useEffect(() => {
        // Workaround: Microsoft Teams initialize two iframes
        // One with real one and one with template url
        // TODO: Find a robust solution to disable second iframe
        if (channel && channel !== "{channelName}") {
            replace(getUrl());
        }
    }, []);

    return <Loader styles={{ height: "100vh" }} />;
};
